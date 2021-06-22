import base64
import json
from flask import request
from sqlalchemy.sql import func
from surt.Utils.logger import Logger
from surt.Models.users import Users
from surt.Utils.response import Response


class Detail:

    def __init__(self):
        # Tenant Database connection instance
        self.connection = request.environ['connection']
        # Tenancy Database connection instance
        self.tenancyConnection = request.environ['tenancyConnection']
        # Post Data
        self.oData = request.get_json().get("data")
        # Logged in User Data
        self.user = request.get_json()['user']
        # Logger Instance
        self.logger = Logger()

    def getDetail(self):
        try:
            response = {"details": ""}
            # Sample to access Databse table
            print('hello')
            print(self.user)
            users = self.tenancyConnection.query(Users).filter(Users.id == self.user.get("id"), ).first()
            details = {
                "name": users.name,
                "email": users.email,
                "phone": users.phone,
                "address": users.address,
                "company": users.company
            }
            response["details"] = details
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def setDetail(self):
        try:

            # Sample to access Databse table
            print(self.oData["name"])
            users = self.tenancyConnection.query(Users).filter(Users.id == self.user.get("id"), ).first()
            users.name = self.oData["name"]
            users.email = self.oData["email"]
            users.phone = self.oData["phone"]
            users.password = base64.b64encode(self.oData["password"].encode("utf-8"))
            users.company = self.oData["company"]
            self.tenancyConnection.commit()
            return Response(200, message="success").send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

