import React from "react";

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-beige)] px-5 py-10 font-sans transition-colors duration-200">
            <div className="mx-auto max-w-[992px]">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-2xl font-bold leading-6 text-[var(--text-primary)] md:text-3xl">
                        Liên Hệ Với Chúng Tôi
                    </h1>
                    <p className="mx-auto max-w-[768px] text-base text-[var(--text-secondary)]">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông
                        tin, chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                    </p>
                </div>

                {/* Contact Info Grid (Thay thế layout cũ do đã bỏ Form) */}
                <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Card 1: Địa chỉ */}
                    <div className="rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 shadow-sm transition-colors duration-200">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)]/10">
                                <svg
                                    className="h-5 w-5 text-[var(--primary)]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                Địa chỉ
                            </h3>
                        </div>
                        <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                            <p>
                                <span className="font-semibold text-[var(--text-primary)]">
                                    Trụ sở chính:
                                </span>{" "}
                                123 Nguyễn Huệ, Quận 1, TP.HCM
                            </p>
                            <p>
                                <span className="font-semibold text-[var(--text-primary)]">
                                    Chi nhánh Hà Nội:
                                </span>{" "}
                                456 Hoàn Kiếm, Hà Nội
                            </p>
                            <p>
                                <span className="font-semibold text-[var(--text-primary)]">
                                    Chi nhánh Đà Nẵng:
                                </span>{" "}
                                789 Hải Châu, Đà Nẵng
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Điện thoại */}
                    <div className="rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 shadow-sm transition-colors duration-200">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)]/10">
                                <svg
                                    className="h-5 w-5 text-[var(--primary)]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                Điện thoại
                            </h3>
                        </div>
                        <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                            <p>
                                <span className="font-semibold text-[var(--text-primary)]">
                                    Hotline:
                                </span>{" "}
                                1900-6789 (24/7)
                            </p>
                            <p>
                                <span className="font-semibold text-[var(--text-primary)]">
                                    Hỗ trợ khách hàng:
                                </span>{" "}
                                028-3822-9999
                            </p>
                            <p>
                                <span className="font-semibold text-[var(--text-primary)]">
                                    Hỗ trợ kỹ thuật:
                                </span>{" "}
                                028-3822-8888
                            </p>
                        </div>
                    </div>

                    {/* Card 3: Email */}
                    <div className="rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 shadow-sm transition-colors duration-200">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)]/10">
                                <svg
                                    className="h-5 w-5 text-[var(--primary)]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                Email
                            </h3>
                        </div>
                        <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                            <p>
                                <span className="font-semibold text-[var(--text-primary)]">
                                    Hỗ trợ chung:
                                </span>{" "}
                                support@busticket.com
                            </p>
                            <p>
                                <span className="font-semibold text-[var(--text-primary)]">
                                    Doanh nghiệp:
                                </span>{" "}
                                business@busticket.com
                            </p>
                            <p>
                                <span className="font-semibold text-[var(--text-primary)]">
                                    Góp ý:
                                </span>{" "}
                                feedback@busticket.com
                            </p>
                        </div>
                    </div>

                    {/* Card 4: Giờ làm việc */}
                    <div className="rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 shadow-sm transition-colors duration-200">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)]/10">
                                <svg
                                    className="h-5 w-5 text-[var(--primary)]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                Giờ làm việc
                            </h3>
                        </div>
                        <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                            <p>
                                <span className="font-semibold text-[var(--text-primary)]">
                                    Thứ 2 - Thứ 6:
                                </span>{" "}
                                8:00 - 18:00
                            </p>
                            <p>
                                <span className="font-semibold text-[var(--text-primary)]">
                                    Thứ 7:
                                </span>{" "}
                                8:00 - 12:00
                            </p>
                            <p>
                                <span className="font-semibold text-[var(--text-primary)]">
                                    Chủ nhật:
                                </span>{" "}
                                Nghỉ (Hotline vẫn hoạt động 24/7)
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 shadow-sm transition-colors duration-200 md:p-8">
                    <div className="mb-6">
                        <h2 className="mb-2 text-xl font-bold text-[var(--text-primary)]">
                            Câu Hỏi Thường Gặp
                        </h2>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Một số câu hỏi thường gặp từ khách hàng
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Question 1 */}
                        <div className="border-b border-[var(--border-gray)] pb-4 last:border-0 last:pb-0">
                            <h4 className="mb-2 font-bold text-[var(--text-primary)]">
                                Tôi có thể đặt vé trước bao lâu?
                            </h4>
                            <p className="text-sm leading-6 text-[var(--text-secondary)]">
                                Bạn có thể đặt vé trước tối đa 30 ngày. Chúng tôi khuyến khích
                                đặt vé sớm để có nhiều lựa chọn chỗ ngồi và giá tốt nhất.
                            </p>
                        </div>

                        {/* Question 2 */}
                        <div className="border-b border-[var(--border-gray)] pb-4 last:border-0 last:pb-0">
                            <h4 className="mb-2 font-bold text-[var(--text-primary)]">
                                Chính sách hủy vé như thế nào?
                            </h4>
                            <p className="text-sm leading-6 text-[var(--text-secondary)]">
                                Bạn có thể hủy vé trước 24 giờ để được hoàn tiền 100%. Từ 12-24
                                giờ: hoàn 50%. Dưới 12 giờ: không hoàn tiền.
                            </p>
                        </div>

                        {/* Question 3 */}
                        <div className="border-b border-[var(--border-gray)] pb-4 last:border-0 last:pb-0">
                            <h4 className="mb-2 font-bold text-[var(--text-primary)]">
                                Tôi có thể mang hành lý gì?
                            </h4>
                            <p className="text-sm leading-6 text-[var(--text-secondary)]">
                                Mỗi khách được mang 1 hành lý xách tay (dưới 7kg) và 1 hành lý
                                ký gửi (dưới 20kg) miễn phí. Hành lí vượt mức sẽ tính phí thêm.
                            </p>
                        </div>

                        {/* Question 4 */}
                        <div className="border-b border-[var(--border-gray)] pb-4 last:border-0 last:pb-0">
                            <h4 className="mb-2 font-bold text-[var(--text-primary)]">
                                Làm thế nào để theo dõi chuyến xe?
                            </h4>
                            <p className="text-sm leading-6 text-[var(--text-secondary)]">
                                Bạn có thể theo dõi vị trí xe theo thời gian thực qua ứng dụng
                                BusTicket sau khi nhập mã vé được cung cấp.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;