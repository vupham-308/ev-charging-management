import React, { useState } from "react";
import {
  Badge,
  Tag,
  Card,
  Button,
  Modal,
  Input,
  Select,
  message,
  Spin,
} from "antd";
import {
  ThunderboltOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  getStatusColor,
  getStatusBorderColor,
  getStatusBgColor,
} from "../utils/statusHelpers";
import { formatDateTime } from "../utils/dateHelpers";
import { useProblems } from "../hooks/useProblems";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Option } = Select;

export const ProblemCard = ({ problem }) => {
  const { isLoading, handleUpdateStatus, handleRespond } = useProblems();

  // --- Local State ---
  const [localStatus, setLocalStatus] = useState(problem.status);
  const [localResponse, setLocalResponse] = useState(problem.response);
  const [solvedTime, setSolvedTime] = useState(problem.solvedAt || null);

  // --- Modal States ---
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isRespondModalVisible, setIsRespondModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState(problem.status);
  const [response, setResponse] = useState("");

  const statusColor = getStatusColor(localStatus);

  // --- Mở modal cập nhật trạng thái (chỉ khi PENDING) ---
  const openStatusModal = () => {
    if (localStatus !== "PENDING") {
      message.warning("Chỉ có thể cập nhật trạng thái khi đang ở trạng thái PENDING!");
      return;
    }
    setNewStatus(localStatus);
    setIsStatusModalVisible(true);
  };

  // --- Mở modal phản hồi (chỉ khi PENDING) ---
  const openRespondModal = () => {
    if (localStatus !== "PENDING") {
      message.warning("Chỉ có thể phản hồi khi sự cố đang ở trạng thái PENDING!");
      return;
    }
    setResponse("");
    setIsRespondModalVisible(true);
  };

  // --- Cập nhật trạng thái ---
  const handleStatusOk = async () => {
    try {
      await handleUpdateStatus(problem.id, { status: newStatus });
      setLocalStatus(newStatus);

      if (newStatus === "SOLVED") {
        const now = new Date();
        setSolvedTime(now); // 👉 Lưu thời gian thực
      }

      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error(error);
      message.error("Không thể cập nhật trạng thái!");
    } finally {
      setIsStatusModalVisible(false);
    }
  };

  // --- Gửi phản hồi ---
  const handleRespondOk = async () => {
  if (!response.trim()) {
    message.warning("Vui lòng nhập nội dung phản hồi!");
    return;
  }

  try {
    // Gửi đúng format mà backend yêu cầu
    await handleRespond(problem.id, { 
      response, 
      status: "SOLVED" // hoặc "IN_PROGRESS" nếu bạn muốn cập nhật song song
    });

    setLocalResponse(response);
    setLocalStatus("SOLVED"); // 👈 update luôn UI
    setSolvedTime(new Date());

    toast.success("Phản hồi và cập nhật trạng thái thành công!");
  } catch (error) {
    console.error(error);
    message.error("Không thể gửi phản hồi!");
  } finally {
    setIsRespondModalVisible(false);
  }
};

  if (isLoading) return <Spin tip="Đang tải..." />;

  return (
    <>
      <Card
        className="shadow-md hover:shadow-xl transition-all duration-300 border-0 hover:-translate-y-1"
        style={{
          borderLeft: `4px solid ${getStatusBorderColor(localStatus)}`,
          backgroundColor: getStatusBgColor(localStatus),
        }}
      >
        {/* --- Header --- */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <ThunderboltOutlined className="text-yellow-500" />
            <span className="text-gray-500">#{problem.id}</span>
            <span>{problem.title || "Không có tiêu đề"}</span>
          </h3>
          <Badge
            status={
              statusColor === "success"
                ? "success"
                : statusColor === "processing"
                ? "processing"
                : statusColor === "error"
                ? "error"
                : statusColor === "warning"
                ? "warning"
                : "default"
            }
            text={<Tag color={statusColor}>{localStatus || "Chưa cập nhật"}</Tag>}
          />
        </div>

        {/* --- Nội dung chính --- */}
        <div className="space-y-2 text-gray-600">
          <p className="flex items-start gap-2">
            <span className="font-medium text-gray-700 min-w-[120px]">Mô tả:</span>
            <span>{problem.description || "Không có mô tả"}</span>
          </p>

          <p className="flex items-center gap-2">
            <span className="font-medium text-gray-700 min-w-[120px]">Trạm:</span>
            <Tag color="blue">{problem?.station?.name || "N/A"}</Tag>
          </p>

          <p className="flex items-center gap-2">
            <span className="font-medium text-gray-700 min-w-[120px]">Thời gian báo cáo:</span>
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-md">
              {formatDateTime(problem.createdAt)}
            </span>
          </p>

          <p className="flex items-center gap-2">
            <span className="font-medium text-gray-700 min-w-[120px]">Báo cáo bởi:</span>
            <Tag color="purple">{problem?.user?.fullName || "Khách hàng"}</Tag>
          </p>

          {/* --- Nếu SOLVED thì hiển thị thông tin --- */}
          {localStatus === "SOLVED" && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md text-sm font-medium">
                <CheckCircleOutlined className="text-green-600" />
                <span>
                  Đã giải quyết:{" "}
                  {solvedTime
                    ? new Date(solvedTime).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Chưa có thời gian"}
                </span>
              </div>

              {localResponse && (
                <div className="ml-6 bg-gray-50 border-l-4 border-green-400 px-3 py-2 rounded-md text-gray-800 italic">
                  {localResponse}
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- Nút hành động (chỉ khi PENDING) --- */}
        {localStatus === "PENDING" && (
          <div className="flex gap-2 mt-4">
            <Button type="primary" onClick={openStatusModal}>
              Cập nhật trạng thái
            </Button>
            <Button onClick={openRespondModal}>Phản hồi</Button>
          </div>
        )}
      </Card>

      {/* --- Modal cập nhật trạng thái --- */}
      <Modal
        title={`Cập nhật trạng thái cho "${problem.title}"`}
        open={isStatusModalVisible}
        onOk={handleStatusOk}
        onCancel={() => setIsStatusModalVisible(false)}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <p>Chọn trạng thái mới:</p>
        <Select
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          style={{ width: "100%" }}
        >
          <Option value="PENDING">Pending</Option>
          <Option value="IN_PROGRESS">In Progress</Option>
          <Option value="SOLVED">Solved</Option>
          <Option value="REJECTED">Rejected</Option>
        </Select>
      </Modal>

      {/* --- Modal phản hồi --- */}
      <Modal
        title={`Phản hồi cho "${problem.title}"`}
        open={isRespondModalVisible}
        onOk={handleRespondOk}
        onCancel={() => setIsRespondModalVisible(false)}
        okText="Gửi"
        cancelText="Hủy"
      >
        <p>Nhập nội dung phản hồi:</p>
        <TextArea
          rows={4}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Nhập nội dung phản hồi..."
        />
      </Modal>
    </>
  );
};
