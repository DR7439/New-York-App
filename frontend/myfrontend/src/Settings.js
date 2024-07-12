import { Button, DatePicker, Form, Input, Modal, Tabs } from "antd";
import { useState } from "react";
import ResetPasswordForm from "./components/ResetPasswordForm";

function PersonalInfo() {
  let [open, setOpen] = useState(false);
  let [form] = Form.useForm();
  let handleSubmit = (values) => {
    console.log(values);
  };
  let handleEdit = () => {
    form.submit()
  };
  let data = {
    email: "john@example.com",
    address: "123 Main St, Anytown, USA",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-01-01",
    nationality: "USA",
    industry: "Software Engineering",
    businessSize: "N/A",
    businessDescription: "N/A",
    budget: "N/A",
  };
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
            <td className={rowClassName}>{data.email}</td>
            <td className={rowClassName}>First Name</td>
            <td className={rowClassName}>{data.firstName}</td>
            <td className={rowClassName}>Last Name</td>
            <td className={rowClassName}>{data.lastName}</td>
          </tr>
          <tr>
            <td className={rowClassName}>Date of Birth</td>
            <td className={rowClassName}>{data.dateOfBirth}</td>
            <td className={rowClassName}>Nationality</td>
            <td className={rowClassName} colSpan={3}>
              {data.nationality}
            </td>
          </tr>
          <tr>
            <td className={rowClassName}>Industry</td>
            <td className={rowClassName}>{data.industry}</td>
            <td className={rowClassName}>Business Size</td>
            <td className={rowClassName}>{data.businessSize}</td>
            <td className={rowClassName}>Budget</td>
            <td className={rowClassName}>{data.budget}</td>
          </tr>
          <tr>
            <td className={rowClassName}>Business Description</td>
            <td className={rowClassName} colSpan={5}>
              {data.businessDescription}
            </td>
          </tr>
        </tbody>
      </table>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleEdit}
        title="Edit Your Personal Info"
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
            <Form.Item name="firstName" label="First Name">
              <Input placeholder="Enter your first name" />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name">
              <Input placeholder="Enter your last name" />
            </Form.Item>
            <Form.Item name="dateOfBirth" label="Date of Birth">
              <DatePicker
                placeholder="Your date of birth"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item name="nationality" label="Nationality">
              <Input placeholder="Enter your nationality" />
            </Form.Item>
            <Form.Item name="industry" label="Industry">
              <Input placeholder="Enter your industry" />
            </Form.Item>
            <Form.Item name="businessSize" label="Business Size">
              <Input placeholder="Enter your business size" />
            </Form.Item>
            <Form.Item
              name="businessDescription"
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

function ResetPassword() {
  let [form] = Form.useForm();
  const handleSubmit = (values) => {
    console.log(values);
  };
  return (
    <div className="mt-3">
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item
          name="email"
          label="Enter your email address to request the link to reset your password."
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Request
          </Button>
        </Form.Item>
      </Form>
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
              children: <ResetPasswordForm label="Enter your email address to request the link to reset password." />,
            },
          ]}
          onChange={onChange}
        />
      </div>
    </>
  );
}
