from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification
from app.websocket.manager import manager
import uuid


async def create_notification(
    db: AsyncSession,
    user_id: uuid.UUID,
    title: str,
    body: str,
    notif_type: str = None,
    ref_id: str = None,
):
    notif = Notification(
        user_id=user_id,
        title=title,
        body=body,
        type=notif_type,
        ref_id=ref_id,
    )
    db.add(notif)
    await db.flush()

    # Push via WebSocket
    await manager.send_to_user(
        str(user_id),
        {
            "type": "notification",
            "id": str(notif.id),
            "title": title,
            "body": body,
            "notif_type": notif_type,
            "ref_id": ref_id,
        },
    )
    return notif
