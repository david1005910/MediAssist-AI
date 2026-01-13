"""Pytest configuration and fixtures."""

import pytest
from typing import AsyncGenerator
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from common.database import Base


TEST_DATABASE_URL = "postgresql+asyncpg://test:test@localhost:5432/test"

engine = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Create a test database session."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
def sample_symptoms():
    """Sample symptoms for testing."""
    return [
        {"name": "두통", "severity": 7, "duration_days": 3},
        {"name": "발열", "severity": 8, "duration_days": 2},
    ]


@pytest.fixture
def sample_patient_info():
    """Sample patient info for testing."""
    return {
        "age": 45,
        "gender": "male",
        "medical_history": ["고혈압", "당뇨"],
    }
