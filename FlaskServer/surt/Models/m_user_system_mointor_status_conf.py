from sqlalchemy import create_engine, MetaData, Table, Column, String, INT, SMALLINT, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class mUserSystemMonitorStatusConf(Base):
    __tablename__ = 'm_usr_system_monitor_status_conf'
    user_id = Column(INT, primary_key=True)
    user_email = Column(String)
    status_type = Column(String, primary_key=True)
    count = Column(INT)
    created_at = Column(DateTime)
    created_by = Column(String)
    updated_at = Column(DateTime)
    updated_by = Column(String)

# ALTER TABLE `22`.m_instance ADD created_at DATETIME NULL;
# ALTER TABLE `22`.m_instance ADD created_by varchar(100) NULL;
# ALTER TABLE `22`.m_instance ADD updated_at DATETIME NULL;
# ALTER TABLE `22`.m_instance ADD updated_by varchar(100) NULL;
