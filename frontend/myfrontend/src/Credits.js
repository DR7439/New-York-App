import { ShoppingOutlined } from "@ant-design/icons";
import { Button, Col, Row, Statistic } from "antd";
import CreditAmountModal from "./components/CreditAmountModal";



export default function Credits() {
    return (
        
        <div>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-medium">Credit Usage</h2>
          {/* <Button type="primary" icon={<ShoppingOutlined />}>
            Top Up Credit
          </Button> */}
          <CreditAmountModal/>
        </div>
        <Row gutter={16} className="mt-2">
          <Col span={8}>
            <Statistic title="Active credits" value={500} />
          </Col>
          <Col span={8}>
            <Statistic title="Used today" value={0} />
          </Col>
          <Col span={8}>
            <Statistic title="Average monthly usage" value={0} />
          </Col>
        </Row>
      </div>
        
    )
}