import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { KalkulationData } from "@/pages/Kalkulation";

interface Props {
  data: KalkulationData;
  update: (p: Partial<KalkulationData>) => void;
}

export function KalkulationNotizen({ data, update }: Props) {
  return (
    <Card className="p-3.5">
      <CardContent className="p-0">
        <Textarea
          value={data.notizen}
          onChange={(e) => update({ notizen: e.target.value })}
          rows={3}
          className="text-[13px] resize-none"
          placeholder="Notizen zur Kalkulation..."
        />
      </CardContent>
    </Card>
  );
}
