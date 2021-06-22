from sqlalchemy import create_engine, MetaData, Table, Column, String, SMALLINT, DateTime, BIGINT, INT, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class tUsers(Base):
    __tablename__ = 'users'
    id = Column(BIGINT, primary_key=True)
    user_type = Column(INT)
    name = Column(String)
    photo = Column(String)
    email = Column(String)
    email_verified_at = Column(TIMESTAMP)
    password = Column(String)
    sap_username = Column(String)
    phone_number = Column(String)
    company = Column(String)
    account_owner = Column(String)
    team = Column(String)
    website = Column(String)
    remember_token = Column(String)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
    address = Column(String)
