import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Tabs,
} from "antd";
import { useEffect, useState } from "react";
import ResetPasswordForm from "./components/ResetPasswordForm";
import axiosInstance from "./axiosInstance";
import dayjs from "dayjs";
import { BUDGETS, BUSINESS_SIZES, INDUSTRIES, NATIONALITIES } from "./constant";
const { Option } = Select;

function PersonalInfo() {
  let [open, setOpen] = useState(false);
  let [data, setData] = useState({});
  let [submitting, setSubmitting] = useState(false);
  let [form] = Form.useForm();
  let handleSubmit = async (values) => {
    console.log(values);
    let formData = new FormData();
    formData.append("email", values.email || "");
    formData.append("first_name", values.first_name || "");
    formData.append("last_name", values.last_name || "");
    formData.append(
      "date_of_birth",
      values.date_of_birth?.format("YYYY-MM-DD") || ""
    );
    formData.append("nationality", values.nationality || "");
    formData.append("industry", values.industry || "");
    formData.append("business_size", values.business_size || "");
    formData.append("business_description", values.business_description || "");
    formData.append("budget", values.budget || "");
    try {
      setSubmitting(true);
      let res = await axiosInstance.put("/api/user/profile/", formData);
      setData(res.data);
      message.success("Your profile has been updated successfully");
      setOpen(false);
    } catch (error) {
      message.error("Something went wrong, please try again");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };
  let handleEdit = () => {
    console.log("handleEdit");
    form.submit();
  };

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        email: data.email || "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        date_of_birth: data.date_of_birth ? dayjs(data.date_of_birth) : "",
        nationality: data.nationality || "",
        industry: data.industry || "",
        business_size: data.business_size || "",
        business_description: data.business_description || "",
        budget: data.budget || "",
      });
    } else {
      form.resetFields();
    }
  });

  useEffect(() => {
    if (Object.keys(data).length === 0) {
      axiosInstance.get("/api/user/profile/").then((res) => {
        setData(res.data);
      });
    }
  }, [data]);
  let rowClassName =
    "border border-neutral-200 px-6 py-4 odd:bg-neutral-100 even";
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button type="primary" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <table className="table border w-full">
        <tbody>
          <tr>
            <td className={rowClassName}>Email Address</td>
            <td className={rowClassName}>{data.email || "N/A"}</td>
            <td className={rowClassName}>First Name</td>
            <td className={rowClassName}>{data.first_name || "N/A"}</td>
            <td className={rowClassName}>Last Name</td>
            <td className={rowClassName}>{data.last_name || "N/A"}</td>
          </tr>
          <tr>
            <td className={rowClassName}>Date of Birth</td>
            <td className={rowClassName}>{data.date_of_birth || "N/A"}</td>
            <td className={rowClassName}>Nationality</td>
            <td className={rowClassName} colSpan={3}>
              {data.nationality || "N/A"}
            </td>
          </tr>
          <tr>
            <td className={rowClassName}>Industry</td>
            <td className={rowClassName}>{data.industry || "N/A"}</td>
            <td className={rowClassName}>Business Size</td>
            <td className={rowClassName}>{data.business_size || "N/A"}</td>
            <td className={rowClassName}>Budget</td>
            <td className={rowClassName}>{data.budget || "N/A"}</td>
          </tr>
          <tr>
            <td className={rowClassName}>Business Description</td>
            <td className={rowClassName} colSpan={5}>
              {data.business_description || "N/A"}
            </td>
          </tr>
        </tbody>
      </table>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleEdit}
        title="Edit Your Personal Info"
        okText="Edit"
        loading={submitting}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            label="Email Address"
            required
            rules={[
              {
                type: "email",
                message: "Please enter a valid email address",
              },
              {
                required: true,
                message: "Please enter your email address",
              },
            ]}
          >
            <Input placeholder="Enter your email address" />
          </Form.Item>
          <div className="grid gap-4 grid-cols-2">
            <Form.Item name="first_name" label="First Name">
              <Input placeholder="Enter your first name" />
            </Form.Item>
            <Form.Item name="last_name" label="Last Name">
              <Input placeholder="Enter your last name" />
            </Form.Item>
            <Form.Item name="date_of_birth" label="Date of Birth">
              <DatePicker
                placeholder="Your date of birth"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item name="nationality" label="Nationality">
              <Select
                placeholder="Select Nationality"
                options={NATIONALITIES.map((nationality) => ({
                  value: nationality,
                  label: nationality,
                }))}
              />
            </Form.Item>
            <Form.Item name="industry" label="Industry">
              <Select
                placeholder="Select Industry"
                options={INDUSTRIES.map((industry) => ({
                  value: industry,
                  label: industry,
                }))}
              />
            </Form.Item>
            <Form.Item name="business_size" label="Business Size">
              <Select
                placeholder="Select Business Size"
                options={BUSINESS_SIZES.map((size) => ({
                  value: size,
                  label: size,
                }))}
              />
            </Form.Item>
            <Form.Item name="budget" label="Budget">
              <Select
                placeholder="Select Budget"
                options={BUDGETS.map((budget) => ({
                  value: budget,
                  label: budget,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="business_description"
              label="Business Description"
              className="col-span-2"
            >
              <Input.TextArea
                autoSize={{ minRows: 4, maxRows: 6 }}
                placeholder="Enter your business description"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default function Settings() {
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <>
      <div>
        <h1 className="text-4xl font-medium">Settings</h1>
        <p className="mt-2 text-neutral-500">
          Manage your personal information and password.
        </p>
      </div>
      <div>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "Personal Info",
              children: <PersonalInfo />,
            },
            {
              key: "2",
              label: "Change Password",
              children: (
                <ResetPasswordForm label="Enter your email address to request the link to reset password." />
              ),
            },
          ]}
          onChange={onChange}
        />
      </div>
    </>
  );
}
