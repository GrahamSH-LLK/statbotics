"use client";

import type { Options } from "highcharts";
import Highcharts from "highcharts/esm/highcharts";
import "highcharts/esm/highcharts-more";

import { Chart } from "@highcharts/react";

const HighchartsBubble = ({ options }: { options: Options }) => (
  <Chart highcharts={Highcharts} options={options} />
);

export default HighchartsBubble;
