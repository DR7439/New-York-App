import { Button, DatePicker, Form, Input, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import axiosInstance from "../axiosInstance";
import React from "react";
import { AGES_RANGES } from "../constant";
import useInterests from "../hooks/useInterests";
import useSearches from "../hooks/useSearches";
import useCredits from "../hooks/useCredits";
import dayjs from "dayjs";

const { Option } = Select;

export default function SearchForm({
  formInstance,
  onSuccess,
  showSubmitButton = true,
  formRef,
}) {
  const interests = useInterests();
  const { fetchSearches } = useSearches();
  const { fetchCreditData } = useCredits();
  const [form] = useForm(formInstance);

  let onFinish = async (values) => {
    let data = new FormData();
    data.append("name", values.name);
    data.append("start_date", values.dateRange[0].format("YYYY-MM-DD"));
    data.append("end_date", values.dateRange[1].format("YYYY-MM-DD"));
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
      onSuccess && onSuccess();
      fetchSearches();
      fetchCreditData();
    } catch (error) {
      console.error(error);
    }
  };

  const disabledDate = (current, info) => {
    let isDisabled = current && current < dayjs().endOf("day");
    if (!isDisabled && info && info.from) {
      let next = dayjs(info.from).add(14, "day");
      let before = dayjs(info.from).subtract(14, "day");
      isDisabled = current > next || current < before;
    }
    return isDisabled;
  };

  return (
    <Form
      ref={formRef}
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
            <Option key={index} value={index + 1}>
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
        <DatePicker.RangePicker
          className="w-full"
          disabledDate={disabledDate}
        />
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
