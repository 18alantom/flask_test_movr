drop database if exists movr;
create database movr;
use movr;

-- product_id is the product's name, (Unique)
create table product (
  product_id varchar(40),
  product_name varchar(128),
  primary key (product_id)
);

-- location_id is the location name, (Unique)
create table location (
  location_id varchar(40),
  location_name varchar(128),
  primary key (location_id)
);

create table product_location (
  product_id varchar(40),
  location_id varchar(40),
  qty int unsigned not null,
  primary key (product_id, location_id),

  foreign key (product_id)
    references product(product_id)
    on delete cascade,
  foreign key (location_id) 
    references location(location_id)
    on delete cascade
);

create table product_movement (
  movement_id varchar(128),
  transaction_time timestamp,
  from_location varchar(128),
  to_location varchar(128),
  product_id varchar(128) not null,
  qty int unsigned not null,
  primary key (movement_id),

  foreign key (product_id, from_location)
    references product_location(product_id, location_id),
  foreign key (from_location)
    references location(location_id)
    on delete cascade,
  foreign key (to_location)
    references location(location_id)
    on delete cascade
);

-- trigger for updating product_location
delimiter $$
create trigger update_qty 
before insert on product_movement
for each row begin
  -- if insufficient quantity or source not present raise excep
  if (
    new.from_location is not null and
      ( 
        select count(*) from product_location
        where (
          product_location.product_id = new.product_id and
          product_location.location_id = new.from_location and
          product_location.qty >= new.qty
        )
      ) = 0
    ) then
    signal sqlstate "45000"
      set message_text = "insufficient quantity";
  
  -- if both to and from are null
  elseif (new.from_location is null and new.to_location is null) then
    signal sqlstate "45000"
      set message_text = "both locations null";

  -- if product hasn't been entered into the product table first
  elseif (
    (
      select count(*) from product
      where product.product_id = new.product_id
    ) = 0
  ) then
    signal sqlstate "45000"
      set message_text = "product absent";
  end if;

  -- subtract quantity from source location
  if (new.from_location is not null) then
    update product_location
    set product_location.qty = product_location.qty - new.qty
    where (
          product_location.product_id = new.product_id and
          product_location.location_id = new.from_location
    );
  end if;

  -- update destination quantity
  if (new.to_location is not null) then
    -- create entry if it isn't preseent
    if (
        (
          select count(*) from product_location where (
            product_location.product_id = new.product_id and
            product_location.location_id = new.to_location
          )
        ) = 0
      ) then
      insert into product_location (product_id, location_id, qty)
      values
        (new.product_id, new.to_location, new.qty);

    -- update entry if it is present
    else
      update product_location
      set product_location.qty = product_location.qty + new.qty
      where (
            product_location.product_id = new.product_id and
            product_location.location_id = new.to_location
      );
    end if;
  end if;
end $$

delimiter ;