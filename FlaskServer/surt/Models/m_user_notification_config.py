from sqlalchemy import create_engine, MetaData, Table, Column, String, INT, SMALLINT, DateTime, TIME
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class mUserNotificationConfig(Base):
    __tablename__ = 'm_user_notification_config'
    user_id = Column(INT, primary_key=True)
    user_email = Column(String)
    module = Column(String, primary_key=True)
    notif_type = Column(String, primary_key=True)
    created_at = Column(DateTime)
    created_by = Column(String)
    updated_at = Column(DateTime)
    updated_by = Column(String)
    description = Column(String)
    allowed = Column(SMALLINT)

# ALTER TABLE `22`.m_instance ADD created_at DATETIME NULL;
# ALTER TABLE `22`.m_instance ADD created_by varchar(100) NULL;
# ALTER TABLE `22`.m_instance ADD updated_at DATETIME NULL;
# ALTER TABLE `22`.m_instance ADD updated_by varchar(100) NULL;
