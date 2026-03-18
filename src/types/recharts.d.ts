// Fix recharts JSX component type compatibility with React 18
import "recharts";

declare module "recharts" {
  export interface CategoricalChartProps {
    children?: React.ReactNode;
  }
}
