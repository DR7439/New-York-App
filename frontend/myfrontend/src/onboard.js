import React, {useState} from 'react';
import { Layout, Menu, theme, Button, Form, Input, DatePicker, Select } from 'antd';
import { SettingFilled, BellOutlined, DashboardOutlined, BarChartOutlined, CreditCardOutlined } from '@ant-design/icons';

const Logo = "Ad Optima"
const { Header, Content,Sider } = Layout;
const { Option } = Select;
const headerNavbarIcons = [Logo, SettingFilled, BellOutlined]
const sideNavbarIcons = [DashboardOutlined, BarChartOutlined, CreditCardOutlined, SettingFilled]
const sideNavbarSections = ["Dashboard", "Analytics", "Credits", "Settings"]

const sideNavbarItems = sideNavbarIcons.map((icon, index)=>{
    const key = String(index + 1);
    const sideNavbarSection = sideNavbarSections[index];
    return {
        key: `sidenav${key}`,
        icon: React.createElement(icon),
        label: sideNavbarSection
    }

});

export default function Onboard(){
    // const {
    //     token: { colorBgContainer, borderRadiusLG },
    //   } = theme.useToken();

    const [size, setSize] = useState('middle');
    const [searchName, setsearchName]=useState("");
    const [businessType, setBusinessType]=useState(null);
    const [targetGender, settargetGender]=useState(null);
    const [targetAge, settargetAge]=useState([]);
    const [dateRange, setDateRange] = useState(null);
    
    const handleSizeChange = (e) => {
    setSize(e.target.value);
    };

    const handleDateChange = (dates) => {
    setDateRange(dates);
    };

    const handletargetAge = (selectedAgeGroup)=>{
        if (!targetAge.includes(selectedAgeGroup)){
            settargetAge([...targetAge, selectedAgeGroup])
        }
        else{
            settargetAge(targetAge.filter((ageGroup)=>
                ageGroup!==selectedAgeGroup))
        }
        
    };

    return (

        <Layout>
                <Header className = "flex items-center justify-between"> 
                <div className="font-medium text-lg text-white">{Logo}</div> 
                    <Menu
                        theme = "dark"
                        mode = "horizontal"
                        items ={headerNavbarIcons}
                    >   
                    </Menu>
                </Header>
                <Content className = "py-0 px-[48px]">
                    <Layout className = "py-[24px] px-0">
                        <Sider className = "w-48">
                            <Menu className = "h-full"
                            mode = "inline"
                            items={sideNavbarItems}
                            >
                            </Menu>

                        </Sider>
                        <Content className="p-6">
                            <div className="text-4xl leading-10 not-italic font-normal font-roboto">Welcome to Ad Optima</div>
                            <div className="font-roboto text-base not-italic font-normal leading-6 text-[#737373]">No tutorial is more effective than giving it a try! Start a free search for optimizing your target advertising today</div>
                            <Form
                                name="basic"
                                layout = "vertical"
                                labelCol={{
                                span: 8,
                                }}
                                wrapperCol={{
                                span: 16,
                                }}
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
                                    onChange = {(e)=>setsearchName(e.target.value)}
                                    placeholder="Search Name"
                                    
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="business type"
                                    label="Business Type"
                                    rules={[
                                    {
                                        required: true,                                        
                                    },
                                    ]}
                                >
                                    <Select placeholder="Select Business Type" value={businessType} onChange={(value)=>setBusinessType(value)}>
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
                                    <Select placeholder="Select Gender" value={targetGender} onChange={(value)=>settargetGender(value)}>
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

                                <Form.Item>
                                    <DatePicker.RangePicker value={dateRange} onChange={handleDateChange}/>
                                </Form.Item>
                                <Form.Item>
                                    <Button type = "primary" htmlType = "submit">Start my free search</Button>
                                </Form.Item>
                            </Form>
                        </Content>
                    </Layout>  
                </Content>
        </Layout>
    )
}


