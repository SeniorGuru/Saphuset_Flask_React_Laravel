import json
from flask import request
from sqlalchemy.sql import func
from surt.Utils.logger import Logger
from surt.Models.m_groups import mGroups
from surt.Models.m_instance_grouper import mInstanceGrouper
from surt.Models.m_instance import mInstance
from surt.Models.m_clients import mClients
from surt.Utils.response import Response
from surt.Models.m_teams import mTeams
from surt.Models.users import Users
from surt.Models.m_functional_area import mFunctionalArea
from datetime import datetime


class Group:

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

    def hello(self):
        try:

            # Sample to access Databse table
            # team =self.connection.query(mTeams).filter(mTeams.id==config.team_id).first()
            return Response(200, message="Hello World").send()
        except Exception as error:
            return Response(500, message="Something went wrong", error=str(error)).send()

    def addGroup(self):
        try:

            # Sample to access Databse table
            # team =self.connection.query(mGroups).filter(mGroups.group_name=="a").first()
            group = mGroups(group_name=self.oData["group_name"], group_description=self.oData["group_description"])
            self.connection.add(group)
            self.connection.commit()
            return Response(200, message="success").send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def getAllGroup(self):
        try:
            response = {"group_list": []}
            # Sample to access Databse table
            groups = self.connection.query(mGroups).filter().all()
            for group in groups:
                group_list = {}
                group_list['group_name'] = group.group_name
                group_list['group_id'] = group.group_id
                group_list["group_description"] = group.group_description
                response["group_list"].append(group_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def getSelectedGroup(self):
        try:
            response = {"group_list": []}
            # Sample to access Databse table
            print(self.oData)
            groups = self.connection.query(mInstanceGrouper).filter(
                mInstanceGrouper.group_id == self.oData["group_id"]).all()
            for group in groups:
                group_list = {}
                group_list['mssysname'] = group.mssysname
                group_list['mandt'] = group.mandt
                group_list["description"] = group.description
                response["group_list"].append(group_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def deleteGroup(self):
        try:
            # Sample to access Databse table
            group = self.connection.query(mGroups).get(self.oData["group_id"])
            self.connection.delete(group)
            self.connection.commit()
            return Response(200, message="success").send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def getGroupedSystem(self):
        try:
            response = {"group_list": []}
            # Sample to access Databse table
            # print(self.oData)
            groups = self.connection.query(mClients, mInstance).join(mInstance,
                                                                     mInstance.mssysname == mClients.mssysname).filter().all()
            for group in groups:
                group_list = {}
                group_list['mssysname'] = group[0].mssysname
                group_list['mandt'] = group[0].mandt
                group_list['description'] = group[1].description
                # group_list['group ']
                # group_list["count"] = group[1]
                response["group_list"].append(group_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def getAllGrouper(self):
        try:
            response = {"group_list": []}
            # Sample to access Databse table
            groups = self.connection.query(mInstanceGrouper, func.count('group_id').label("count")).group_by(
                'mandt').group_by('mssysname').filter().all()
            for group in groups:
                group_list = {}
                group_list['selectGroup'] = []
                group_list['mssysname'] = group[0].mssysname
                group_list['group_id'] = group[0].group_id
                group_list['mandt'] = group[0].mandt
                group_list['description'] = group[0].description
                group_list['count'] = group[1]
                selGroup = self.connection.query(mInstanceGrouper).filter(mInstanceGrouper.mandt == group[0].mandt,
                                                                          mInstanceGrouper.mssysname == group[
                                                                              0].mssysname).all()
                for sel in selGroup:
                    group_list['selectGroup'].append(sel.group_id)
                response["group_list"].append(group_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def addGrouper(self):
        try:

            # Sample to access Databse table
            self.connection.query(mInstanceGrouper).filter(
                mInstanceGrouper.mssysname == self.oData["group"]["mssysname"],
                mInstanceGrouper.mandt == self.oData["group"]["mandt"]).delete()
            self.connection.commit()
            for sel in self.oData['selected']:
                newGrouper = mInstanceGrouper(mssysname=self.oData["group"]["mssysname"],
                                              mandt=self.oData["group"]["mandt"],
                                              description=self.oData["group"]["description"], group_id=int(sel))
                self.connection.add(newGrouper)
                self.connection.commit()
            return Response(200, message="success").send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def editGroup(self):
        try:

            # Sample to access Databse table
            print(self.oData)
            group = self.connection.query(mGroups).get(self.oData["group_id"])
            print(group.group_name)
            group.group_name = self.oData["group_name"]
            group.group_description = self.oData["group_description"]
            self.connection.commit()
            return Response(200, message="success").send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()
