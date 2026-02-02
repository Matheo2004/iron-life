import { Card, CardContent, Typography } from "@mui/material";

export default function DashboardCard({ title, value, subtitle }) {
  return (
    <Card sx={{ minWidth: 200, borderRadius: 3, boxShadow: 3, m: 1 }}>
      <CardContent>
        <Typography variant="h6" color="text.secondary">{title}</Typography>
        <Typography variant="h4" sx={{ mt: 1 }}>{value}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
      </CardContent>
    </Card>
  );
}
