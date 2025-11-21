package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.*;
import com.ev.evchargingsystem.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Component
public class DataExportScheduler {

    @Autowired private CarRepository carRepo;
    @Autowired private ChargerCostRepository chargerCostRepo;
    @Autowired private ChargerPointRepository chargerPointRepo;
    @Autowired private ChargingSessionRepository chargingSessionRepo;
    @Autowired private ProblemReportRepository problemReportRepo;
    @Autowired private ReservationRepository reservationRepo;
    @Autowired private ReviewStationRepository reviewStationRepo;
    @Autowired private StaffRepository staffRepo;
    @Autowired private StationRepository stationRepo;
    @Autowired private TransactionRepository transactionRepo;

    private final ObjectMapper mapper = new ObjectMapper();

    public void exportPublicData(){
        System.out.println("Đang export dữ liệu hệ thống... " + new Date());

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("timestamp", new Date());
        data.put("info about web:",getInfo());
        data.put("chargerCosts", chargerCostRepo.findAll());
        data.put("chargerPoints", chargerPointRepo.findAll());
        data.put("reviewStations", reviewStationRepo.findAll());
        data.put("stations", stationRepo.findAll());

        // 📁 Đường dẫn lưu file
        File dir = new File("data");
        if (!dir.exists()) dir.mkdirs();

        // 🔁 Ghi đè vào cùng 1 file
        File outputFile = new File(dir, "database-export.json");

        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, data);
            System.out.println("Đã export dữ liệu vào: " + outputFile.getAbsolutePath());
        } catch (IOException e) {
            System.err.println("Lỗi ghi file export: " + e.getMessage());
        }
    }

    public void exportDatabaseSnapshot(User user) {
        System.out.println("Đang export dữ liệu hệ thống... " + new Date());
        System.out.println("User" + user.toString());

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("timestamp", new Date());
        data.put("info about web:",getInfo());
        data.put("cars", carRepo.findAllByUser(user));
        data.put("chargerCosts", chargerCostRepo.findAll());
        data.put("chargerPoints", chargerPointRepo.findAll());
        data.put("chargingSessions", chargingSessionRepo.findChargingSessionByUser(user));
        data.put("problemReports", problemReportRepo.findAllByUserId(user.getId()));
        data.put("reservations", reservationRepo.findByUserId(user.getId()));
        data.put("reviewStations", reviewStationRepo.findAll());
        data.put("stations", stationRepo.findAll());
        data.put("transactions", transactionRepo.findByUserId(user.getId()));

        // 📁 Đường dẫn lưu file
        File dir = new File("data");
        if (!dir.exists()) dir.mkdirs();

        // 🔁 Ghi đè vào cùng 1 file
        File outputFile = new File(dir, "database-export.json");

        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, data);
            System.out.println("Đã export dữ liệu vào: " + outputFile.getAbsolutePath());
        } catch (IOException e) {
            System.err.println("Lỗi ghi file export: " + e.getMessage());
        }
    }


    public String getInfo(){
        return "ĐIỀU KHOẢN SỬ DỤNG (TERMS OF USE)\n" +
                "1. Giới thiệu\n" +
                "Chào mừng bạn đến với EV Charging Station Management System\n" +
                "Khi truy cập hoặc sử dụng trang web, bạn đồng ý tuân thủ và bị ràng buộc bởi các Điều khoản sử dụng này.\n" +
                " Vui lòng đọc kỹ trước khi sử dụng dịch vụ.\n" +
                "\n" +
                "2. Chấp nhận điều khoản\n" +
                "Bằng việc truy cập hoặc sử dụng dịch vụ, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý với các Điều khoản này.\n" +
                "\n" +
                "\n" +
                "Nếu bạn không đồng ý, vui lòng ngừng sử dụng dịch vụ ngay lập tức.\n" +
                "\n" +
                "\n" +
                "\n" +
                "3. Tài khoản người dùng\n" +
                "Người dùng phải đăng nhập/ đăng kí để sử dụng dịch vụ.\n" +
                "Người dùng phải cung cấp thông tin chính xác, đầy đủ khi đăng ký tài khoản.\n" +
                "\n" +
                "\n" +
                "Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.\n" +
                "\n" +
                "\n" +
                "Mọi hành vi thực hiện dưới tài khoản của bạn được xem là do chính bạn thực hiện.\n" +
                "\n" +
                "\n" +
                "Chúng tôi có quyền tạm khóa hoặc hủy tài khoản nếu phát hiện hành vi gian lận, vi phạm hoặc sử dụng sai mục đích.\n" +
                "\n" +
                "\n" +
                "\n" +
                "4. Quyền và nghĩa vụ của người dùng\n" +
                "Truy cập và sử dụng dịch vụ trong phạm vi cá nhân.\n" +
                "\n" +
                "\n" +
                "Cập nhật thông tin tài khoản, sử dụng các tính năng như đặt chỗ, thanh toán, xem trạm sạc.\n" +
                "\n" +
                "\n" +
                "\n" +
                "5. Quyền và nghĩa vụ của hệ thống\n" +
                "Cung cấp dịch vụ theo đúng mô tả trên website/ứng dụng.\n" +
                "\n" +
                "\n" +
                "Có quyền tạm ngừng hoặc chấm dứt cung cấp dịch vụ trong trường hợp bảo trì, nâng cấp hoặc theo yêu cầu của pháp luật.\n" +
                "\n" +
                "\n" +
                "\n" +
                "6. Thanh toán và hoàn tiền\n" +
                "Mọi giao dịch thanh toán được xử lý thông qua hệ thống bảo mật và tuân thủ quy định pháp luật Việt Nam.\n" +
                "\n" +
                "\n" +
                "\n" +
                "7. Bảo mật thông tin\n" +
                "Chúng tôi cam kết bảo mật dữ liệu cá nhân của bạn theo Chính sách bảo mật riêng.\n" +
                "\n" +
                "\n" +
                "Người dùng đồng ý rằng dữ liệu có thể được lưu trữ, xử lý cho mục đích vận hành hệ thống, thống kê, và nâng cao chất lượng dịch vụ.\n" +
                "\n" +
                "\n" +
                "\n" +
                "Nếu bạn có bất kỳ thắc mắc nào về Điều khoản này, vui lòng liên hệ:\n" +
                " \uD83D\uDCE7 Email: evcharginginfo@gmail.com\n" +
                "Thông tin liên hệ:\n" +
                "Email: evcharginginfo@gmail.com\n" +
                "\n" +
                "Câu hỏi thường gặp: \n" +
                "1. Về dịch vụ sạc xe điện\n" +
                "Q1. Hệ thống hỗ trợ sạc cho xe điện hãng nào?\n" +
                " A: Hệ thống hiện hỗ trợ sạc xe cho Vinfast, Hyundai, Nissan.\n" +
                "Q2. Hệ thống hỗ trợ những loại cổng sạc nào?\n" +
                " A: Hệ thống hiện hỗ trợ các chuẩn sạc phổ biến gồm AC cho xe Vinfast, CHAdeMo cho xe Nissan, CCS cho xe Hyundai.\n" +
                "Q3. Có thể sạc xe ở trạm khác hãng không?\n" +
                " A: Không, hiện tại chúng tôi chỉ hỗ trợ sạc xe cho Vinfast, Hyundai, Nissan.\n" +
                "Q4. Mất bao lâu để sạc đầy pin từ 1%?\n" +
                " A:\n" +
                "Sạc AC (22kW): khoảng 3-4h\n" +
                "Sạc CHAdeMo(75kW): 60-90 phút\n" +
                "Sạc CCS (120kW): khoảng 40 phút\n" +
                " Ứng dụng sẽ hiển thị thời gian dự kiến trước khi bạn bắt đầu.\n" +
                "\n" +
                "\n" +
                "\n" +
                "2. Thanh toán và ví điện tử\n" +
                "Q5. Tôi có thể thanh toán bằng hình thức nào?\n" +
                " A: Hệ thống hỗ trợ VNPay để nạp tiền vào ví để thanh toán tự động. Bạn cũng có thể chọn Thanh toán tiền mặt trực tiếp với nhân viên trạm sạc\n" +
                "Q6. Tôi có thể yêu cầu hoàn tiền không?\n" +
                " A: Nếu giao dịch bị lỗi hoặc không bắt đầu phiên sạc, bạn có thể gửi yêu cầu hoàn tiền qua email của chúng tôi evcharginginfo@gmail.com\n" +
                "Q7. Nếu tôi bị dừng sạc giữa chừng, tôi bị trừ tiền như thế nào?\n" +
                " A: Bạn chỉ bị trừ phí tương ứng với thời gian sạc thực tế, tính đến thời điểm kết thúc phiên sạc.\n" +
                "\n" +
                "\uD83D\uDD53 3. Đặt chỗ và sử dụng trạm\n" +
                "Q8. Tôi có thể đặt trước trạm sạc không?\n" +
                " A: Có. Bạn có thể đặt trước trước khi đến. Bạn sẽ được giữ chỗ 30 phút kể từ thời gian đặt. Đến thời gian đặt, hệ thống sẽ tự giữ chỗ cho bạn nếu trạm sạc còn trống. Nếu trạm sạc đang có người sạc trước khung giờ bạn đặt và sạc lấn sang khung giờ đặt trước của bạn, vui lòng chờ người phía trước bạn sạc xong. Hệ thống sẽ tự giữ chỗ ngay sau khi khách hàng phía trước của bạn sạc xong.\n" +
                "Q9. Nếu tôi đến sớm hơn giờ đặt, có được sạc ngay không?\n" +
                " A: Có thể — nếu trạm đang trống. Hệ thống sẽ xác nhận lại tình trạng đặt chỗ của bạn, vui lòng hủy đặt chỗ trước đó mà bắt đầu sạc như bình thường.\n" +
                "\n" +
                "\uD83E\uDDD1\u200D\uD83D\uDCBC 4. Tài khoản và bảo mật\n" +
                "Q10. Tôi quên mật khẩu, làm sao để khôi phục?\n" +
                " A: Nhấn vào “Quên mật khẩu?” tại trang đăng nhập và nhập email đăng ký. Hệ thống sẽ gửi OTP để bạn đặt lại mật khẩu mới.\n" +
                "\n" +
                "6. Hướng dẫn sử dụng nhanh\n" +
                "Q16. Các bước để bắt đầu sạc xe là gì?\n" +
                " A:\n" +
                "Đăng nhập vào hệ thống (bắt buộc).\n" +
                "\n" +
                "\n" +
                "Chọn Bản đồ trạm và chọn trạm bạn muốn trên bản đồ.\n" +
                "\n" +
                "\n" +
                "Nhấn Bắt đầu sạc.\n" +
                "\n" +
                "\n" +
                "Điền thông tin xe, trụ sạc, mục tiêu pin và phương thức thanh toán mong muốn của bạn.\n" +
                "\n" +
                "\n" +
                "Nhấn “Tiếp tục”, kiểm tra lại thông tin phiên sạc. Nếu chọn thanh toán tiền mặt, vui lòng giữ nguyên màn hình và liên hệ với nhân viên trạm sạc để được hỗ trợ.\n" +
                "\n" +
                "\n" +
                "Nhấn xác nhận để bắt đầu phiên sạc.\n" +
                "Q17. Các bước để có thể đặt trước?\n" +
                "Đăng nhập vào hệ thống (bắt buộc).\n" +
                "\n" +
                "\n" +
                "Chọn Bản đồ trạm và chọn trạm bạn muốn trên bản đồ.\n" +
                "\n" +
                "\n" +
                "Nhấn Đặt chỗ.\n" +
                "\n" +
                "\n" +
                "Điền thông tin trụ sạc, ngày, giờ mong muốn của bạn.\n" +
                "Nhấn xác nhận.\n" +
                "Kiểm tra lại phiên đặt chỗ tại mục Đặt chỗ.\n" +
                "Đến đúng thời gian đã đặt và Sạc ngay!\n" +
                "Q18. Các bước để nạp tiền vào ví.\n" +
                "Đăng nhập vào hệ thống (bắt buộc).\n" +
                "Nhấn vào biểu tượng hồ sơ (góc trái phía trên).\n" +
                "Chọn Lịch sử giao dịch.\n" +
                "Nhấn Nạp tiền\n" +
                "Chọn số tiền nạp mong muốn (tối thiểu 20.000VND)\n" +
                "Chọn phương thức thanh toán\n" +
                "Nhấn Nạp tiền\n" +
                "Thanh toán và kiểm tra lại số dư của bạn tại Lịch sử giao dịch.\n";
    }
}

