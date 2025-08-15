"""starter column in game participant

Revision ID: 23711a17c5cc
Revises: a5a515880792
Create Date: 2025-08-15 10:22:11.936458
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '23711a17c5cc'
down_revision: Union[str, Sequence[str], None] = 'a5a515880792'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Step 1: Add with a default so old rows are filled
    op.add_column(
        'game_participants',
        sa.Column('starter', sa.Boolean(), server_default=sa.false(), nullable=False)
    )
    # Step 2: Remove server_default if you don’t want future auto-fills
    op.alter_column('game_participants', 'starter', server_default=None)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('game_participants', 'starter')
