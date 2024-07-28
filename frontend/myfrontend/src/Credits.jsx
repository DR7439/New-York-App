import { TransactionOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Row, Statistic } from "antd";
import { Link } from "react-router-dom";
import CreditAmountModal from "./components/CreditAmountModal";
import useCredits from "./hooks/useCredits";

export default function Credits({ isDashboard }) {
  const { credits } = useCredits();
  let activeCredits = credits.active;
  const showWarning = activeCredits > 0 && activeCredits <= 30
  const showError = activeCredits === 0

  return (
    <div>
      {showWarning && <Alert
        message="You are running out of credits! Top up credits now to continue your searches."
        type="warning"
        showIcon
        className="mb-6"
      /> }
      {showError && <Alert
        message="You have used up all your credits! Top up credits now to continue your searches."
        type="error"
        showIcon
        className="mb-6"
      />}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-medium">Credit Usage</h2>
        {isDashboard ? (
          <Link to="/credits">
            <Button type="primary" icon={<TransactionOutlined />}>
              Manage Credits
            </Button>
          </Link>
        ) : (
          <CreditAmountModal />
        )}
      </div>
      <Row gutter={16} className="mt-2">
        <Col span={8}>
          <Statistic title="Active credits" value={activeCredits ?? "--"} />
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
