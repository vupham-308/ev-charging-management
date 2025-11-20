import React from "react";

const ManageTermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              ĐIỀU KHOẢN SỬ DỤNG
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              (TERMS OF USE) — EV Charging Station Management System
            </p>
          </div>
        </header>

        <main className="prose prose-lg max-w-none text-gray-800">
          <section>
            <h2 className="font-bold mt-6 mb-2">1. Giới thiệu</h2>
            <p className="mb-4">
              Chào mừng bạn đến với EV Charging Station Management System. Khi
              truy cập hoặc sử dụng trang web, bạn đồng ý tuân thủ và bị ràng
              buộc bởi các Điều khoản sử dụng này. Vui lòng đọc kỹ trước khi sử
              dụng dịch vụ.
            </p>
          </section>

          <section>
            <h2 className="font-bold mt-6 mb-2">2. Chấp nhận điều khoản</h2>
            <p className="mb-4">
              Bằng việc truy cập hoặc sử dụng dịch vụ, bạn xác nhận rằng bạn đã
              đọc, hiểu và đồng ý với các Điều khoản này. Nếu bạn không đồng ý,
              vui lòng ngừng sử dụng dịch vụ ngay lập tức.
            </p>
          </section>

          <section>
            <h2 className="font-bold mt-6 mb-2">3. Tài khoản người dùng</h2>
            <ul className="space-y-2">
              <li>Người dùng phải đăng nhập/đăng kí để sử dụng dịch vụ.</li>
              <li>
                Người dùng phải cung cấp thông tin chính xác, đầy đủ khi đăng ký
                tài khoản.
              </li>
              <li>
                Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.
              </li>
              <li>
                Mọi hành vi thực hiện dưới tài khoản của bạn được xem là do
                chính bạn thực hiện.
              </li>
              <li>
                Chúng tôi có quyền tạm khóa hoặc hủy tài khoản nếu phát hiện
                hành vi gian lận, vi phạm hoặc sử dụng sai mục đích.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold mt-6 mb-2">
              4. Quyền và nghĩa vụ của người dùng
            </h2>
            <p className="mb-4">
              Truy cập và sử dụng dịch vụ trong phạm vi cá nhân.
            </p>
            <p className="mb-4">
              Cập nhật thông tin tài khoản, sử dụng các tính năng như đặt chỗ,
              thanh toán, xem trạm sạc.
            </p>
          </section>

          <section>
            <h2 className="font-bold mt-6 mb-2">
              5. Quyền và nghĩa vụ của hệ thống
            </h2>
            <p className="mb-4">
              Cung cấp dịch vụ theo đúng mô tả trên website/ứng dụng.
            </p>
            <p className="mb-4">
              Có quyền tạm ngừng hoặc chấm dứt cung cấp dịch vụ trong trường hợp
              bảo trì, nâng cấp hoặc theo yêu cầu của pháp luật.
            </p>
          </section>

          <section>
            <h2 className="font-bold mt-6 mb-2">6. Thanh toán và hoàn tiền</h2>
            <p className="mb-4">
              Mọi giao dịch thanh toán được xử lý thông qua hệ thống bảo mật và
              tuân thủ quy định pháp luật Việt Nam.
            </p>
          </section>

          <section>
            <h2 className="font-bold mt-6 mb-2">7. Bảo mật thông tin</h2>
            <p className="mb-4">
              Chúng tôi cam kết bảo mật dữ liệu cá nhân của bạn theo Chính sách
              bảo mật riêng. Người dùng đồng ý rằng dữ liệu có thể được lưu trữ,
              xử lý cho mục đích vận hành hệ thống, thống kê, và nâng cao chất
              lượng dịch vụ.
            </p>
          </section>

          <section>
            <h2 className="font-bold mt-6 mb-2">Liên hệ</h2>
            <p className="mb-4">
              Nếu bạn có bất kỳ thắc mắc nào về Điều khoản này, vui lòng liên
              hệ: <br />
              <strong>📧 Email:</strong>{" "}
              <a href="mailto:evcharginginfo@gmail.com">
                evcharginginfo@gmail.com
              </a>
            </p>
          </section>
        </main>

        <footer className="mt-8 text-sm text-gray-500 border-t pt-4 flex items-center justify-between">
          <div>
            © {new Date().getFullYear()} EV Charging Station Management System
          </div>
          <div>Phiên bản: 1.0</div>
        </footer>
      </div>
    </div>
  );
};

export default ManageTermsOfUse;
