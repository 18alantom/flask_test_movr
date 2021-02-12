import pymysql.cursors
from dotenv import load_dotenv
from .constants import PROD, LOCN, PRMO, PRLO, report_query, movement_query, required_cols
from .helpers import get_id, get_timestamp, insert_sql

load_dotenv()


class DBConnectionHandler:
    def __init__(self, user="root", password="00000000", host="localhost", database="movr"):
        self.connection = pymysql.connections.Connection(
            user=user,
            password=password,
            host=host,
            database=database
        )

    def execute_query(self, query, has_return):
        """
        return : (flag, message/content)
        """
        ret = None
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query)
                if has_return:
                    ret = cursor.fetchall()
            # self.connection.commit()
        except Exception as err:
            return (False, str(err))
        return (True, ret)

    def insert(self, table_name, cols=[], vals=[]):
        # Returns True,None if success else False and error message.
        cols = required_cols[table_name] + tuple(cols)
        insert_query = insert_sql(table_name, cols, vals)
        return self.execute_query(insert_query, False)

    def select(self, table_name):
        # Product or location or movements.
        select_query = f"select * from {table_name};"
        return self.execute_query(select_query, True)

    def update(self, table_name, new_name, row_id):
        # Update the product or location name.
        update_query = (f'update {table_name} set {table_name}_name="{new_name}" '
                        f'where {table_name}_id="{row_id}";')
        return self.execute_query(update_query, False)

    def delete(self, table_name, row_id, col_name=None):
        # Delete a certain row from a table, deleting a row will erase all transactions
        if table_name in [PROD, LOCN]:
            # Delete references
            for ref_table in [PRMO, PRLO]:
                if table_name == LOCN and ref_table == PRMO:
                    q = f'delete from {ref_table} where from_location="{row_id}" or to_location="{row_id}";'
                else:
                    q = f'delete from {ref_table} where {table_name}_id="{row_id}";'

                ret, msg = self.execute_query(q, False)
                if not ret:
                    return (ret, msg)

            delete_query = f'delete from {table_name} where {table_name}_id = "{row_id}";'
        else:
            delete_query = f'delete from {table_name} where {col_name} = "{row_id}";'
        return self.execute_query(delete_query, False)

    def move(self, product_id=None, from_location=None, to_location=None, qty=None):
        # Updates the product movement table
        cols = []
        vals = [get_id(), get_timestamp(), product_id, qty]
        if from_location is not None:
            cols += ("from_location", )
            vals.append(from_location)
        if to_location is not None:
            cols += ("to_location", )
            vals.append(to_location)
        return self.insert(PRMO, cols, vals)

    def report(self):
        # Returns the report of what is where
        return self.execute_query(report_query, True)

    def movement(self):
        # Returns the report of what is where
        return self.execute_query(movement_query, True)
