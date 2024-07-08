import { Column } from '@ant-design/charts';
import React from 'react';
import ReactDOM from 'react-dom';

const ColumnChart = () => {
  const config = {
    data: {
      type: 'fetch',
      value: 'https://render.alipay.com/p/yuyan/180020010001215413/antd-charts/column-column.json',
    },
    xField: 'letter',
    yField: 'frequency',
  };
  return <Column {...config} />;
};

export default ColumnChart;