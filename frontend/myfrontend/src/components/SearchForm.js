import React, { useState } from "react";
import { Button, Form, Input, DatePicker, Select } from "antd";

const { Option } = Select;

export default function SearchForm({showSubmitButton = true}) {
  const [size, setSize] = useState("middle");
  const [searchName, setsearchName] = useState("");
  const [businessType, setBusinessType] = useState(null);
  const [targetGender, settargetGender] = useState(null);
  const [targetAge, settargetAge] = useState([]);
  const [targetMarket, settargetMarket] = useState([]);

  const [dateRange, setDateRange] = useState(null);

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const handletargetAge = (selectedAgeGroup) => {
    if (!targetAge.includes(selectedAgeGroup)) {
      settargetAge([...targetAge, selectedAgeGroup]);
    } else {
      settargetAge(
        targetAge.filter((ageGroup) => ageGroup !== selectedAgeGroup)
      );
    }
  };

  const handletargetMarketInterest = (selectedMarket) => {
    if (!targetMarket.includes(selectedMarket)) {
      settargetMarket([...targetMarket, selectedMarket]);
    } else {
      settargetMarket(
        targetMarket.filter((SelectedTargetMarket) => SelectedTargetMarket !== selectedMarket)
      );
    }
  };

  return (
    <Form
      name="basic"
      layout="vertical"
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      autoComplete="off"
    >
      <Form.Item
        label="Search Name"
        name="search name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input
          value={searchName}
          onChange={(e) => setsearchName(e.target.value)}
          placeholder="Search Name"
        />
      </Form.Item>
      <Form.Item
        name="target market"
        label="Target Market Interest"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          mode="tags"
          placeholder="Select Target Market Interest"
          value={targetMarket}
          onChange={settargetMarket}
        >
          <Option value="Restaurant">Restaurant</Option>
          <Option value="Education">Education</Option>
          <Option value="Technology">Technology</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="target gender"
        label="Target Gender"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="Select Gender"
          value={targetGender}
          onChange={(value) => settargetGender(value)}
        >
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
          <Option value="Male and Female">Male and Female</Option>
          <Option value="Other">Other</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="target age"
        label="Target Age"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          mode="tags"

          size={size}
          placeholder="Select age group"
          value={targetAge}
          onChange={handletargetAge}
        >
          <Option value="18-25">18-25</Option>
          <Option value="25-40">25-40</Option>
          <Option value="40-60">40-60</Option>
          <Option value="60+">60+</Option>
          

          

        </Select>
      </Form.Item>

      <Form.Item
        name="date"
        label="Target Date"
        rules={[
          {
            required: true,
          },
        ]}
        >
        <DatePicker.RangePicker className="w-full" value={dateRange} onChange={handleDateChange} />
      </Form.Item>
      {showSubmitButton && <Form.Item>
        <Button type="primary" htmlType="submit">
          Start my free search
        </Button>
      </Form.Item>}
    </Form>
  );
}
