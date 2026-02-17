import { Stack, Button, TableCell } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

export default function ActionsCell({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel
}: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <TableCell align={isRTL ? "left" : "right"}>
      <Stack
        direction={isRTL ? "row-reverse" : "row"}
        spacing={1}
        justifyContent={isRTL ? "flex-start" : "flex-end"}
        alignItems="center"
      >
        {onEdit && (
          <Button size="small" onClick={onEdit}>
            {editLabel ?? t("edit")}
          </Button>
        )}

        {onDelete && (
          <Button size="small" color="error" onClick={onDelete}>
            {deleteLabel ?? t("delete")}
          </Button>
        )}
      </Stack>
    </TableCell>
  );
}
