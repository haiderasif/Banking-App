import { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import { useAuth } from "../Auth/auth";

export function Linechart() {
  const { transdata } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const chartSetting = {
    yAxis: [
      {
        label: "rainfall (mm)",
      },
    ],
    width: isMobile ? 400 : 600,
    height: 400,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
    },
  };

  // Dataset shows total spending of the last 5 days
  const dataset = transdata.map((transaction) => ({
    Total_Spending: transaction.Amount,
    day: transaction.Current_Day,
  }));

  // Conditionally render the BarChart or a message
  return (
    <div>
      {dataset.length > 0 ? (
        <BarChart
          dataset={dataset}
          xAxis={[{ scaleType: "band", dataKey: "day" }]}
          series={[{ dataKey: "Total_Spending", label: "Total_Spending" }]}
          {...chartSetting}
        />
      ) : (
        <p style={{ padding: "40px" }}>Not enough data available</p>
      )}
    </div>
  );
}
