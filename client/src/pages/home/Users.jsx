import React from "react";
import { Grid, Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

const Users = ({ filteredUsers }) => {
  // אם אין יוזרים מתאימים, מציגים הודעה
  if (!filteredUsers || filteredUsers.length === 0) {
    return <Typography variant="h6" color="textSecondary" sx={{ textAlign: "center", padding: "20px" }}>No users found with the selected filters.</Typography>;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Grid container spacing={3}>
        {filteredUsers.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: "100%", width: "100%", boxShadow: 3, borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <CardMedia
                component="img"
                height="200"
                image={ "https://via.placeholder.com/200" || user.images[0] }
                alt={user.fullname}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{textAlign: "start",   padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                  {user.fullname}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                  {user.description || "No description available."}
                </Typography>
                <Typography variant="body2">
                  <strong>Professions:</strong> {user.professions.join(", ")}
                </Typography>
                <Typography variant="body2">
                  <strong>Hourly Rate:</strong> ${user.hourlyRate}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Users;
