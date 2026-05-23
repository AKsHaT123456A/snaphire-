"""initial schema

Revision ID: 0001
Revises:
Create Date: 2024-01-01 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("phone", sa.String(15), unique=True, nullable=False),
        sa.Column("name", sa.String(100), nullable=True),
        sa.Column("role", sa.Enum("worker", "employer", name="userrole"), nullable=False),
        sa.Column("is_active", sa.Boolean(), default=True),
        sa.Column("is_verified", sa.Boolean(), default=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )
    op.create_index("ix_users_phone", "users", ["phone"])

    op.create_table(
        "worker_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), unique=True),
        sa.Column("skill_category", sa.String(50), nullable=True),
        sa.Column("experience_years", sa.Integer(), default=0),
        sa.Column("daily_wage", sa.Float(), default=0.0),
        sa.Column("bio", sa.String(500), nullable=True),
        sa.Column("photo_url", sa.String(500), nullable=True),
        sa.Column("languages", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("city", sa.String(100), nullable=True),
        sa.Column("is_available", sa.Boolean(), default=True),
        sa.Column("is_verified", sa.Boolean(), default=False),
        sa.Column("rating", sa.Float(), default=0.0),
        sa.Column("total_reviews", sa.Integer(), default=0),
        sa.Column("completed_jobs", sa.Integer(), default=0),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )

    op.create_table(
        "employer_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), unique=True),
        sa.Column("company_name", sa.String(200), nullable=True),
        sa.Column("industry", sa.String(100), nullable=True),
        sa.Column("photo_url", sa.String(500), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("city", sa.String(100), nullable=True),
        sa.Column("rating", sa.Float(), default=0.0),
        sa.Column("total_reviews", sa.Integer(), default=0),
        sa.Column("total_hires", sa.Integer(), default=0),
        sa.Column("is_verified", sa.Boolean(), default=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )

    op.create_table(
        "jobs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("employer_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("employer_profiles.id")),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("skill_category", sa.Enum(
            "mason","carpenter","electrician","painter","plumber","welder",
            "tile_worker","driver","labour_helper","ac_technician", name="skillcategory"
        ), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("workers_needed", sa.Integer(), default=1),
        sa.Column("daily_wage", sa.Float(), nullable=False),
        sa.Column("duration_days", sa.Integer(), default=1),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("city", sa.String(100), nullable=True),
        sa.Column("address", sa.String(300), nullable=True),
        sa.Column("is_urgent", sa.Boolean(), default=False),
        sa.Column("is_immediate", sa.Boolean(), default=True),
        sa.Column("safety_equipment", sa.Boolean(), default=False),
        sa.Column("start_time", sa.DateTime(), nullable=True),
        sa.Column("status", sa.Enum("open","in_progress","completed","cancelled", name="jobstatus"), default="open"),
        sa.Column("is_deleted", sa.Boolean(), default=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )

    op.create_table(
        "hires",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("job_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("jobs.id")),
        sa.Column("worker_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("worker_profiles.id")),
        sa.Column("employer_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("employer_profiles.id")),
        sa.Column("agreed_wage", sa.Float(), nullable=False),
        sa.Column("status", sa.Enum(
            "pending","accepted","rejected","on_the_way","started","completed",
            "payment_pending","payment_done","cancelled", name="hirestatus"
        ), default="pending"),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )

    op.create_table(
        "reviews",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("hire_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("hires.id")),
        sa.Column("worker_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("worker_profiles.id")),
        sa.Column("employer_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("employer_profiles.id")),
        sa.Column("rating", sa.Float(), nullable=False),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )

    op.create_table(
        "notifications",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("type", sa.String(50), nullable=True),
        sa.Column("ref_id", sa.String(100), nullable=True),
        sa.Column("is_read", sa.Boolean(), default=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )

    op.create_table(
        "wallets",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), unique=True),
        sa.Column("balance", sa.Float(), default=0.0),
        sa.Column("total_earned", sa.Float(), default=0.0),
        sa.Column("total_spent", sa.Float(), default=0.0),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )

    op.create_table(
        "transactions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("wallet_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("wallets.id")),
        sa.Column("hire_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("hires.id"), nullable=True),
        sa.Column("type", sa.Enum("credit","debit","pending", name="transactiontype"), nullable=False),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("transactions")
    op.drop_table("wallets")
    op.drop_table("notifications")
    op.drop_table("reviews")
    op.drop_table("hires")
    op.drop_table("jobs")
    op.drop_table("employer_profiles")
    op.drop_table("worker_profiles")
    op.drop_table("users")
    op.execute("DROP TYPE IF EXISTS userrole")
    op.execute("DROP TYPE IF EXISTS skillcategory")
    op.execute("DROP TYPE IF EXISTS jobstatus")
    op.execute("DROP TYPE IF EXISTS hirestatus")
    op.execute("DROP TYPE IF EXISTS transactiontype")
