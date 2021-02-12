import os
# import json

from flask import Flask, request, jsonify
from dotenv import load_dotenv

from .db import DBConnectionHandler
from .helpers import parse_report, strify, get_id

load_dotenv()
app = Flask(__name__)
db = DBConnectionHandler(
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASS"),
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME")
)

# Used for getting data
data_responses = {
    "products":  (lambda: db.select("product")),
    "locations": (lambda: db.select("location")),
    "movements": (lambda: strify(db.movement())),
    "report": (lambda: parse_report(db.report()))
}


@app.after_request
def allow_cors_if_dev(res):
    if os.getenv("FLASK_ENV") == "development":
        res.headers["Access-Control-Allow-Origin"] = os.getenv("DEV_ORIGIN")
        res.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        res.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept"
    return res

# @app.route("/test", methods=["GET"])
# def test_get():
#     return "Hello, World!"


# @app.route("/test", methods=["POST"])
# def test_post():
#     json_data = request.get_json()
#     if json_data is None:
#         res = {"got": "no json data"}
#     else:
#         json_data = json.loads(json_data)
#         res = {"got": json_data}

#     return jsonify(res)

@app.route("/data", methods=["POST"])
def get_data():
    # For receiving row data.
    data_names = request.get_json()
    response = {name: data_responses[name]() if name in data_responses else [False, "invalid"]
                for name in data_names}
    return jsonify(response)


@app.route("/data", methods=["PUT"])
def put_row():
    # Route used only for inserting new products and locations.
    json_data = request.get_json()

    suc, msg = db.insert(json_data["table"], vals=[
                         get_id(), json_data["value"]])
    return jsonify([suc, msg])


@app.route("/data", methods=["PATCH"])
def update_row():
    # Route used only for changing product and location names.
    json_data = request.get_json()

    suc, msg = db.update(json_data["table"],
                         json_data["value"], json_data["id"])
    return jsonify([suc, msg])


@app.route("/data", methods=["DELETE"])
def del_row():
    # Route used only for deleting product and location rows.
    json_data = request.get_json()

    suc, msg = db.delete(json_data["table"], json_data["id"])
    return jsonify([suc, msg])


@app.route("/move", methods=["PUT"])
def move_products():
    json_data = request.get_json()

    suc, msg = db.move(product_id=json_data["product_id"], from_location=json_data["from"],
                       to_location=json_data["to"], qty=int(json_data["quantity"]))
    return jsonify([suc, msg])
