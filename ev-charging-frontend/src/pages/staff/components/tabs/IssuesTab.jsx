import { Card, Button, Modal, Form, Input, message } from "antd";
import { WarningOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { ProblemCard } from "../ProblemCard.";
import { StatusBadges } from "../StatusBadges.";
import { getStatusCounts } from "../../utils/problemHelpers";
import { useProblems } from "./../../hooks/useProblems";
import { useCreateProblem } from "../../hooks/useCreateProblem";
import { useReportedProblems } from "../../hooks/useReportedProblems";
import { useState } from "react"; 

const { TextArea } = Input;

export const IssuesTab = () => {
  const { problems, isLoading, refetch, setProblems } = useProblems();
  const { reportedProblems, isLoading: isLoadingReported, fetchReportedProblems, setReportedProblems } = useReportedProblems();
  const { handleCreateProblem, loading: creatingProblem } = useCreateProblem();
  const statusCounts = getStatusCounts(problems);
  const [activeTabKey, setActiveTabKey] = useState("customer"); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // --- Phân loại sự cố ---
  const customerProblems = problems; // Chỉ sự cố từ khách hàng
  const reportedProblemsList = reportedProblems; // Sự cố đã báo cáo từ API (bao gồm cả của nhân viên)

  // Hàm xử lý mở modal báo cáo sự cố
  const handleOpenReportModal = () => {
    setIsModalVisible(true);
  };

  // Hàm xử lý đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Hàm thêm problem mới vào local state (CHỈ thêm vào reported problems)
  const addProblemToLocalState = (newProblem) => {
    // CHỈ thêm vào danh sách reported problems (tab Sự cố đã báo cáo)
    // KHÔNG thêm vào problems (tab Từ khách hàng) vì đây là báo cáo của nhân viên
    setReportedProblems(prev => [newProblem, ...prev]);
  };

  const handleSubmitProblemToAdmin = async (values) => {
    try {
      const stationId = 4; // Thay bằng stationId từ context/global state
      
      const problemData = {
        title: values.title,
        description: values.description,
        // Có thể thêm flag để phân biệt đây là báo cáo từ nhân viên
        reportedBy: "staff" // hoặc "employee"
      };

      // Gửi request tạo problem và nhận kết quả trả về
      const newProblem = await handleCreateProblem(stationId, problemData);
      
      // CẬP NHẬT NGAY LẬP TỨC VÀO STATE (CHỈ reported problems)
      if (newProblem) {
        addProblemToLocalState(newProblem);
      }
      
      message.success("Báo cáo sự cố đã được gửi thành công đến quản trị viên!");
      setIsModalVisible(false);
      form.resetFields();
      
      // Đồng bộ với server (chạy ngầm, không ảnh hưởng UX)
      setTimeout(() => {
        refetch(); // Vẫn refetch problems từ khách hàng
        fetchReportedProblems(); // Và refetch reported problems
      }, 1000);
      
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi báo cáo sự cố!");
      console.error("Error submitting problem to admin:", error);
    }
  };

  // Hàm render nội dung cho từng tab
  const renderProblemList = (list, tabType, loading) => {
    // Sắp xếp theo ngày tạo (mới nhất trước)
    const sortedList = [...list].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    if (loading && list.length === 0) {
      return (
        <Card className="text-center py-12 shadow-sm border-dashed">
          <p className="text-gray-500 text-lg">Đang tải danh sách sự cố...</p>
        </Card>
      );
    }

    if (sortedList.length === 0) {
      return (
        <Card className="text-center py-12 shadow-sm border-dashed">
          <WarningOutlined className="text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">
            {tabType === "customer" 
              ? "Không có sự cố nào từ khách hàng"
              : "Không có sự cố đã được báo cáo"}
          </p>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {sortedList.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>
    );
  };
  
  // Lựa chọn danh sách sự cố dựa trên tab đang hoạt động
  const getCurrentProblemList = () => {
    if (activeTabKey === "customer") {
      return {
        list: customerProblems,
        loading: isLoading
      };
    } else {
      return {
        list: reportedProblemsList,
        loading: isLoadingReported
      };
    }
  };

  const currentProblemList = getCurrentProblemList();
  const customerCount = customerProblems.length;
  const reportedCount = reportedProblemsList.length;

  return (
    <div className="w-full bg-gray-50 min-h-screen flex justify-center py-5">
        {/* Container chính */}
        <div className="w-[80%] max-w-6xl bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-8">
        
        {/* Header và Status Badges */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">Quản lý sự cố</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status Badges - chỉ hiển thị cho problems từ khách hàng */}
            {problems.length > 0 && <StatusBadges counts={statusCounts} />}
            
            {/* Nút báo cáo sự cố LÊN ADMIN */}
            <Button 
              type="primary" 
              icon={<ExclamationCircleOutlined />}
              onClick={handleOpenReportModal}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600"
            >
              Báo cáo sự cố lên Admin
            </Button>
          </div>
        </div>
        
        <p className="text-gray-500 mb-4">
            Xem và xử lý báo cáo sự cố từ khách hàng và nhân viên tại trạm này
          </p>
        

        {/* --- KHU VỰC THAY THẾ TABS (Sử dụng DIV/Button để mô phỏng Tab) --- */}
        <div className="p-1 bg-gray-100 rounded-lg flex space-x-1 shadow-inner mt-6">
          
          {/* Tab "Từ khách hàng" - CHỈ sự cố từ khách hàng */}
          <div
            className={`
              flex-1 text-center py-2 px-4 rounded-lg cursor-pointer transition-colors font-semibold 
              ${activeTabKey === 'customer' 
                ? 'bg-white text-gray-800 shadow-md'
                : 'bg-transparent text-gray-500 hover:bg-gray-200'
              }
            `}
            onClick={() => setActiveTabKey('customer')}
          >
            Từ khách hàng ({customerCount})
          </div>

          {/* Tab "Sự cố đã báo cáo" - SỰ CỐ ĐÃ BÁO CÁO LÊN ADMIN (của nhân viên) */}
          <div
            className={`
              flex-1 text-center py-2 px-4 rounded-lg cursor-pointer transition-colors font-semibold
              ${activeTabKey === 'reported' 
                ? 'bg-white text-gray-800 shadow-md'
                : 'bg-transparent text-gray-500 hover:bg-gray-200'
              }
            `}
            onClick={() => setActiveTabKey('reported')}
          >
            Sự cố đã báo cáo ({reportedCount})
          </div>
        </div>
        {/* --- Kết thúc KHU VỰC TAB TÙY CHỈNH --- */}
        
        {/* Hiển thị danh sách sự cố tương ứng */}
        <div className="mt-4">
            {renderProblemList(
              currentProblemList.list, 
              activeTabKey, 
              currentProblemList.loading
            )}
        </div>
      </div>

      {/* Modal báo cáo sự cố LÊN ADMIN */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExclamationCircleOutlined className="text-blue-600" />
            <span>Báo cáo sự cố lên Quản trị viên</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={500}
        destroyOnClose
      >
        <p className="text-gray-600 mb-4">
          Mô tả chi tiết sự cố bạn gặp phải. Báo cáo này sẽ được gửi trực tiếp đến đội ngũ quản trị để xử lý.
        </p>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitProblemToAdmin}
          className="mt-4"
        >
          <Form.Item
            name="title"
            label="Tiêu đề sự cố"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề sự cố!" },
              { min: 5, message: "Tiêu đề phải có ít nhất 5 ký tự!" }
            ]}
          >
            <Input placeholder="Nhập tiêu đề sự cố..." />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả chi tiết"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả sự cố!" },
              { min: 10, message: "Mô tả phải có ít nhất 10 ký tự!" }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Mô tả chi tiết về sự cố bạn đang gặp phải..." 
            />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={handleCancel}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={creatingProblem}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Gửi báo cáo đến Admin
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};