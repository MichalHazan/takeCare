import React from "react";
import Chip from "@mui/material/Chip";

export default function SingleChip({ id, label, variant, clicked, onClick }) {
    return (
        <Chip
            label={label}
            variant={variant}
            color={clicked ? "primary" : "default"}
            onClick={() => onClick(id)}
            sx={{
                display: "inline-flex", // מוודא שהצ'יפ מתאים לתוכן בלבד
                justifyContent: "center", // ממקם את התוכן במרכז אופקי
                alignItems: "center", // ממקם את התוכן במרכז אנכי
                fontSize: "1rem", // מגדיר גודל טקסט אחיד
                padding: "8px 12px", // מספק מרווח פנימי אחיד
                borderRadius: "16px", // צורה עגלגלה עם קצוות רכים
                whiteSpace: "nowrap", // מונע שבירת שורה
                overflow: "hidden", // מוודא שאין גלילה פנימית
                textOverflow: "clip", // מציג את כל הטקסט (ללא חיתוך)
                minWidth: "80px", // מבטיח התאמה מדויקת לאורך הטקסט
            }}
        />
    );
}