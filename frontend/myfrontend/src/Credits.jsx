import { EyeOutlined } from "@ant-design/icons";
import { Button, Col, Row, Statistic } from "antd";
import { Link } from "react-router-dom";
import CreditAmountModal from "./components/CreditAmountModal";
import useCredits from "./hooks/useCredits";

export default function Credits({ isDashboard }) {
  const { credits } = useCredits();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-medium">Credit Usage</h2>

        {isDashboard ? (
          <Link to="/credits">
            <Button type="primary" icon={<EyeOutlined />}>
              Manage Credits
            </Button>
          </Link>
        ) : (
          <CreditAmountModal />
        )}
      </div>
      <Row gutter={16} className="mt-2">
        <Col span={8}>
          <Statistic title="Active credits" value={credits.active} />
        </Col>
        <Col span={8}>
          <Statistic title="Used today" value={credits.usedToday} />
        </Col>
        <Col span={8}>
          <Statistic title="Used this month" value={credits.usedThisMonth} />
        </Col>
      </Row>
    </div>
  );
}
