# Constants
PROD = "product"
LOCN = "location"
PRLO = "product_location"
PRMO = "product_movement"

names = [PROD, LOCN, PRLO, PRMO]

required_cols = {
    PROD: ("product_id", "product_name"),
    LOCN: ("location_id", "location_name"),
    PRLO: ("product_id", "location_id", "qty"),
    PRMO: ("movement_id", "transaction_time", "product_id", "qty")
}

report_cols = 'product_id', 'product_name', 'location_id', 'location_name', 'qty'
report_query = """
select product.product_id, product_name,location.location_id, location_name, qty 
from  product, location, product_location
where (
    product.product_id = product_location.product_id and
    location.location_id = product_location.location_id
);"""

movement_query = """
select  p.product_name, l1.location_name as from_location, 
l2.location_name as to_location, pm.qty, pm.transaction_time
from product_movement `pm`
join product `p` on p.product_id = pm.product_id
left join location `l1` on l1.location_id = pm.from_location
left join location `l2` on l2.location_id = pm.to_location;"""
