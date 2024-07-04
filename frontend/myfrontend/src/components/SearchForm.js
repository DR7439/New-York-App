import { Button, DatePicker, Form, Input, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import axiosInstance from "../axiosInstance"; 
import React from "react";
import { AGES_RANGES } from "../constant";
import useInterests from "../hooks/useInterests";

const { Option } = Select;

export default function SearchForm({ showSubmitButton = true }) {
  const interests = useInterests();
  const [form] = useForm();
  let onFinish = async (values) => {
    let data = new FormData();
    data.append("name", values.name);
    data.append("start_date", values.dateRange[0].toISOString().split("T")[0]);
    data.append("end_date", values.dateRange[1].toISOString().split("T")[0]);
    data.append("date_search_made_on", new Date().toISOString().split("T")[0]);
    values.targetMarkets.forEach((market) => {
      data.append("target_market_interests", market);
    });
    values.targetAges.forEach((age) => {
      data.append("target_age", age);
    });
    data.append("gender", values.targetGender);
    // cors allow origin
    try {
      const res = await axiosInstance.post("/api/search/", data);
      console.log("9779 res", res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form
      name="basic"
      form={form}
      layout="vertical"
      style={{
        maxWidth: 600,
      }}
      onFinish={onFinish}
      initialValues={{
        remember: true,
      }}
      autoComplete="off"
    >
      <Form.Item
        label="Search Name"
        name="name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="Search Name" />
      </Form.Item>
      <Form.Item
        name="targetMarkets"
        label="Target Market Interest"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select mode="tags" placeholder="Select Target Market Interest">
          {interests.map((interest, index) => (
            <Option key={index} value={interest.name}>
              {interest.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="targetGender"
        label="Target Gender"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select placeholder="Select Gender">
          <Option value="M">Male</Option>
          <Option value="F">Female</Option>
          <Option value="B">Both Genders</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="targetAges"
        label="Target Age"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select mode="tags" placeholder="Select age group">
          {AGES_RANGES.map((age_range, index) => (
            <Option key={index} value={index}>
              {age_range}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="dateRange"
        label="Target Date"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <DatePicker.RangePicker className="w-full" />
      </Form.Item>
      {showSubmitButton && (
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Start my free search
          </Button>
        </Form.Item>
      )}
    </Form>
  );
}
