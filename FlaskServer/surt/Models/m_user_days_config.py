from sqlalchemy import create_engine,MetaData,Table,Column,String,INT,SMALLINT,DateTime
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class mUserDaysConfig(Base):
    __tablename__ = 'm_user_days_config'
    id=Column(INT, primary_key = True)
    user_id=Column(INT)
    user_email=Column(String)
    module=Column(String)
    sunday=Column(SMALLINT)
    sunday = Column(SMALLINT)
    monday = Column(SMALLINT)
    tuesday = Column(SMALLINT)
    wednesday = Column(SMALLINT)
    thursday = Column(SMALLINT)
    friday = Column(SMALLINT)
    saturday = Column(SMALLINT)
    created_at = Column(DateTime)
    created_by = Column(String)
    updated_at = Column(DateTime)
    updated_by = Column(String)






# ALTER TABLE `22`.m_instance ADD created_at DATETIME NULL;
# ALTER TABLE `22`.m_instance ADD created_by varchar(100) NULL;
# ALTER TABLE `22`.m_instance ADD updated_at DATETIME NULL;
# ALTER TABLE `22`.m_instance ADD updated_by varchar(100) NULL;
