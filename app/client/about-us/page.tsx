import React from "react";

const AboutUsPage = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-beige)] px-5 py-10 font-sans transition-colors duration-200">
            <div className="mx-auto max-w-[992px]">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <div className="mb-4 inline-block rounded-lg bg-[var(--primary-light)] px-4 py-[3px]">
                        <span className="text-xs font-bold text-white">Về chúng tôi</span>
                    </div>
                    <h1 className="mb-4 text-2xl font-bold leading-6 text-[var(--text-primary)] md:text-3xl">
                        FUBABus - Đồng Hành Cùng Hành Trình
                    </h1>
                    <p className="mx-auto max-w-[768px] text-lg leading-7 text-[var(--text-secondary)]">
                        Với hơn 14 năm kinh nghiệm trong ngành vận tải hành khách, chúng tôi
                        tự hào là đối tác đáng tin cậy cho hàng triệu chuyến đi mỗi năm, kết
                        nối mọi miền đất nước.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Stat 1 */}
                    <div className="rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 text-center shadow-sm">
                        <div className="mx-auto mb-4 h-12 w-12">
                            <svg fill="none" viewBox="0 0 48 48">
                                <path
                                    d="M40 42V38C40 35.8783 39.1571 33.8434 37.6569 32.3431C36.1566 30.8429 34.1217 30 32 30H16C13.8783 30 11.8434 30.8429 10.3431 32.3431C8.84286 33.8434 8 35.8783 8 38V42"
                                    stroke="var(--stat-blue-text)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                />
                                <path
                                    d="M24 22C28.4183 22 32 18.4183 32 14C32 9.58172 28.4183 6 24 6C19.5817 6 16 9.58172 16 14C16 18.4183 19.5817 22 24 22Z"
                                    stroke="var(--stat-blue-text)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                />
                            </svg>
                        </div>
                        <div className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
                            2M+
                        </div>
                        <div className="text-[var(--text-secondary)]">Khách hàng</div>
                    </div>

                    {/* Stat 2 */}
                    <div className="rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 text-center shadow-sm">
                        <div className="mx-auto mb-4 h-12 w-12">
                            <svg fill="none" viewBox="0 0 48 48">
                                <path
                                    d="M16 12V24"
                                    stroke="var(--stat-green-text)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                />
                                <path
                                    d="M30 12V24"
                                    stroke="var(--stat-green-text)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                />
                                <path
                                    d="M4 24H43.2"
                                    stroke="var(--stat-green-text)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                />
                                <path
                                    d="M6 24L12 6H36L42 24"
                                    stroke="var(--stat-green-text)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                />
                                <path
                                    d="M6 24V42C6 42.5304 6.21071 43.0391 6.58579 43.4142C6.96086 43.7893 7.46957 44 8 44H40C40.5304 44 41.0391 43.7893 41.4142 43.4142C41.7893 43.0391 42 42.5304 42 42V24"
                                    stroke="var(--stat-green-text)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                />
                                <path
                                    d="M18 36H28"
                                    stroke="var(--stat-green-text)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                />
                                <path
                                    d="M22 30V42"
                                    stroke="var(--stat-green-text)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                />
                            </svg>
                        </div>
                        <div className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
                            500+
                        </div>
                        <div className="text-[var(--text-secondary)]">Xe khách</div>
                    </div>

                    {/* Stat 3 */}
                    <div className="rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 text-center shadow-sm">
                        <div className="mx-auto mb-4 h-12 w-12">
                            <svg fill="none" viewBox="0 0 48 48">
                                <path
                                    d="M42 20C42 34 24 46 24 46C24 46 6 34 6 20C6 15.7565 7.68571 11.6869 10.6863 8.68629C13.6869 5.68571 17.7565 4 22 4H26C30.2435 4 34.3131 5.68571 37.3137 8.68629C40.3143 11.6869 42 15.7565 42 20Z"
                                    stroke="var(--stat-purple-text)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                />
                                <path
                                    d="M24 26C27.3137 26 30 23.3137 30 20C30 16.6863 27.3137 14 24 14C20.6863 14 18 16.6863 18 20C18 23.3137 20.6863 26 24 26Z"
                                    stroke="var(--stat-purple-text)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                />
                            </svg>
                        </div>
                        <div className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
                            100+
                        </div>
                        <div className="text-[var(--text-secondary)]">Tuyến đường</div>
                    </div>

                    {/* Stat 4 */}
                    <div className="rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 text-center shadow-sm">
                        <div className="mx-auto mb-4 h-12 w-12">
                            <svg fill="none" viewBox="0 0 48 48">
                                <path
                                    d="M24 2L30.18 14.52L44 16.56L34 26.28L36.36 40.04L24 33.52L11.64 40.04L14 26.28L4 16.56L17.82 14.52L24 2Z"
                                    stroke="var(--stat-orange-text)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                />
                            </svg>
                        </div>
                        <div className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
                            15+
                        </div>
                        <div className="text-[var(--text-secondary)]">Giải thưởng</div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 shadow-sm">
                        <div className="mb-[30px] flex items-center gap-2">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path
                                    d="M21 10H3"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M21 6H3"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M21 14H3"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M21 18H3"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                            </svg>
                            <h3 className="text-base font-bold text-[var(--text-primary)]">
                                Sứ Mệnh
                            </h3>
                        </div>
                        <p className="leading-6 text-[var(--text-secondary)]">
                            Mang đến dịch vụ vận chuyển hành khách an toàn, tiện lợi và chất
                            lượng cao, kết nối mọi người với những điểm đến trên khắp cả nước.
                            Chúng tôi cam kết không ngừng cải tiến để đáp ứng và vượt qua mong
                            đợi của khách hàng.
                        </p>
                    </div>

                    <div className="rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 shadow-sm">
                        <div className="mb-[30px] flex items-center gap-2">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path
                                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M12 15c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                            </svg>
                            <h3 className="text-base font-bold text-[var(--text-primary)]">
                                Tầm Nhìn
                            </h3>
                        </div>
                        <p className="leading-6 text-[var(--text-secondary)]">
                            Trở thành hệ thống vận tải hành khách hàng đầu Việt Nam vào năm
                            2030, tiên phong trong việc ứng dụng công nghệ để mang lại trải
                            nghiệm tuyệt vời nhất. Mở rộng mạng lưới toàn quốc và vươn ra khu
                            vực Đông Nam Á.
                        </p>
                    </div>
                </div>

                {/* Core Values */}
                <div className="mb-12 rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 shadow-sm">
                    <div className="mb-[30px]">
                        <h2 className="mb-1.5 text-base font-bold text-[var(--text-primary)]">
                            Giá Trị Cốt Lõi
                        </h2>
                        <p className="leading-6 text-[var(--text-secondary)]">
                            Những giá trị định hướng mọi hoạt động của chúng tôi
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                        {/* Value Item 1 */}
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-light)]/10">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 32 32">
                                    <path
                                        d="M16 29.3333C23.3638 29.3333 29.3333 23.3638 29.3333 16C29.3333 8.63619 23.3638 2.66666 16 2.66666C8.63619 2.66666 2.66666 8.63619 2.66666 16C2.66666 23.3638 8.63619 29.3333 16 29.3333Z"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                    <path
                                        d="M10.6667 16L14.6667 20L21.3333 12"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                </svg>
                            </div>
                            <h4 className="mb-2 text-lg font-bold text-[var(--text-primary)]">
                                An toàn
                            </h4>
                            <p className="text-sm leading-5 text-[var(--text-secondary)]">
                                Đặt an toàn của khách hàng lên hàng đầu với đội ngũ tài xế
                                chuyên nghiệp.
                            </p>
                        </div>

                        {/* Value Item 2 */}
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-light)]/10">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 32 32">
                                    <path
                                        d="M16 29.3333C23.3638 29.3333 29.3333 23.3638 29.3333 16C29.3333 8.63619 23.3638 2.66666 16 2.66666C8.63619 2.66666 2.66666 8.63619 2.66666 16C2.66666 23.3638 8.63619 29.3333 16 29.3333Z"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                    <path
                                        d="M16 21.3333C18.9455 21.3333 21.3333 18.9455 21.3333 16C21.3333 13.0545 18.9455 10.6667 16 10.6667C13.0545 10.6667 10.6667 13.0545 10.6667 16C10.6667 18.9455 13.0545 21.3333 16 21.3333Z"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                </svg>
                            </div>
                            <h4 className="mb-2 text-lg font-bold text-[var(--text-primary)]">
                                Tận tâm
                            </h4>
                            <p className="text-sm leading-5 text-[var(--text-secondary)]">
                                Phục vụ khách hàng bằng cả trái tim, luôn lắng nghe và đáp ứng
                                mọi nhu cầu.
                            </p>
                        </div>

                        {/* Value Item 3 */}
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-light)]/10">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 32 32">
                                    <path
                                        d="M16 5.33334V26.6667"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                    <path
                                        d="M22.6667 9.33334L16 2.66667L9.33334 9.33334"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                    <path
                                        d="M9.33334 22.6667L16 29.3333L22.6667 22.6667"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                </svg>
                            </div>
                            <h4 className="mb-2 text-lg font-bold text-[var(--text-primary)]">
                                Phát triển
                            </h4>
                            <p className="text-sm leading-5 text-[var(--text-secondary)]">
                                Không ngừng đổi mới, cải tiến để mang đến dịch vụ tốt nhất.
                            </p>
                        </div>

                        {/* Value Item 4 */}
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-light)]/10">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 32 32">
                                    <path
                                        d="M24 10.6667L14.6667 20L10.6667 16"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                    <path
                                        d="M16 29.3333C23.3638 29.3333 29.3333 23.3638 29.3333 16C29.3333 8.63619 23.3638 2.66666 16 2.66666C8.63619 2.66666 2.66666 8.63619 2.66666 16C2.66666 23.3638 8.63619 29.3333 16 29.3333Z"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                </svg>
                            </div>
                            <h4 className="mb-2 text-lg font-bold text-[var(--text-primary)]">
                                Uy tín
                            </h4>
                            <p className="text-sm leading-5 text-[var(--text-secondary)]">
                                Xây dựng niềm tin thông qua chất lượng dịch vụ và sự minh bạch.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="mb-12 rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 shadow-sm">
                    <div className="mb-[30px]">
                        <div className="mb-1.5 flex items-center gap-2">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path
                                    d="M8 2V6"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M16 2V6"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M3 10H21"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M3 8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H19C19.5304 6 20.0391 6.21071 20.4142 6.58579C20.7893 6.96086 21 7.46957 21 8V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V8Z"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                            </svg>
                            <h2 className="text-base font-bold text-[var(--text-primary)]">
                                Hành Trình Phát Triển
                            </h2>
                        </div>
                        <p className="leading-6 text-[var(--text-secondary)]">
                            Những mốc quan trọng trong quá trình phát triển của BusTicket
                        </p>
                    </div>
                    <div className="mt-[30px] grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                        {/* Timeline Item 1 */}
                        <div className="text-center">
                            <div className="mb-2 inline-block rounded-full bg-[var(--primary-light)] px-4 py-2 text-base font-medium text-white">
                                2010
                            </div>
                            <div className="mx-auto mb-4 h-5 w-[1px] bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)]"></div>
                            <h4 className="mb-2 text-lg font-bold text-[var(--text-primary)]">
                                Khởi đầu
                            </h4>
                            <p className="leading-6 text-[var(--text-secondary)]">
                                BusTicket được thành lập với 5 xe và 2 tuyến đường tại TP.HCM
                            </p>
                        </div>
                        {/* Timeline Item 2 */}
                        <div className="text-center">
                            <div className="mb-2 inline-block rounded-full bg-[var(--primary-light)] px-4 py-2 text-base font-medium text-white">
                                2015
                            </div>
                            <div className="mx-auto mb-4 h-5 w-[1px] bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)]"></div>
                            <h4 className="mb-2 text-lg font-bold text-[var(--text-primary)]">
                                Mở rộng
                            </h4>
                            <p className="leading-6 text-[var(--text-secondary)]">
                                Mở rộng mạng lưới ra 15 tỉnh thành với 50+ xe khách
                            </p>
                        </div>
                        {/* Timeline Item 3 */}
                        <div className="text-center">
                            <div className="mb-2 inline-block rounded-full bg-[var(--primary-light)] px-4 py-2 text-base font-medium text-white">
                                2020
                            </div>
                            <div className="mx-auto mb-4 h-5 w-[1px] bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)]"></div>
                            <h4 className="mb-2 text-lg font-bold text-[var(--text-primary)]">
                                Chuyển đổi số
                            </h4>
                            <p className="leading-6 text-[var(--text-secondary)]">
                                Ra mắt ứng dụng di động và hệ thống đặt vé online toàn quốc
                            </p>
                        </div>
                        {/* Timeline Item 4 */}
                        <div className="text-center">
                            <div className="mb-2 inline-block rounded-full bg-[var(--primary-light)] px-4 py-2 text-base font-medium text-white">
                                2025
                            </div>
                            <div className="mx-auto mb-4 h-5 w-[1px] bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)]"></div>
                            <h4 className="mb-2 text-lg font-bold text-[var(--text-primary)]">
                                Dẫn đầu
                            </h4>
                            <p className="leading-6 text-[var(--text-secondary)]">
                                Trở thành hệ thống vận tải hành khách lớn nhất miền Nam
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team */}
                <div className="mb-12 rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 shadow-sm">
                    <div className="mb-[30px]">
                        <div className="mb-1.5 flex items-center gap-2">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path
                                    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M23 21v-2a4 4 0 0 0-3-3.87"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M16 3.13a4 4 0 0 1 0 7.75"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                            </svg>
                            <h2 className="text-base font-bold text-[var(--text-primary)]">
                                Đội Lãnh Đạo
                            </h2>
                        </div>
                        <p className="leading-6 text-[var(--text-secondary)]">
                            Đội ngũ quản lý giàu kinh nghiệm và tâm huyết
                        </p>
                    </div>
                    <div className="mt-[30px] grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                        {/* Team Member 1 */}
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-light)]/10">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 32 32">
                                    <path
                                        d="M26.6667 28V25.3333C26.6667 23.9188 26.1048 22.5623 25.1046 21.5621C24.1044 20.5619 22.7478 20 21.3333 20H10.6667C9.25218 20 7.89562 20.5619 6.89543 21.5621C5.89524 22.5623 5.33333 23.9188 5.33333 25.3333V28"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                    <path
                                        d="M16 14.6667C18.9455 14.6667 21.3333 12.2789 21.3333 9.33333C21.3333 6.38781 18.9455 4 16 4C13.0545 4 10.6667 6.38781 10.6667 9.33333C10.6667 12.2789 13.0545 14.6667 16 14.6667Z"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                </svg>
                            </div>
                            <h4 className="mb-1 text-base font-bold text-[var(--text-primary)]">
                                Nguyễn Văn A
                            </h4>
                            <p className="text-sm leading-5 text-[var(--text-secondary)]">
                                CEO & Founder
                            </p>
                        </div>
                        {/* Team Member 2 */}
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-light)]/10">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 32 32">
                                    <path
                                        d="M26.6667 28V25.3333C26.6667 23.9188 26.1048 22.5623 25.1046 21.5621C24.1044 20.5619 22.7478 20 21.3333 20H10.6667C9.25218 20 7.89562 20.5619 6.89543 21.5621C5.89524 22.5623 5.33333 23.9188 5.33333 25.3333V28"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                    <path
                                        d="M16 14.6667C18.9455 14.6667 21.3333 12.2789 21.3333 9.33333C21.3333 6.38781 18.9455 4 16 4C13.0545 4 10.6667 6.38781 10.6667 9.33333C10.6667 12.2789 13.0545 14.6667 16 14.6667Z"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                </svg>
                            </div>
                            <h4 className="mb-1 text-base font-bold text-[var(--text-primary)]">
                                Trần Thị B
                            </h4>
                            <p className="text-sm leading-5 text-[var(--text-secondary)]">
                                Giám đốc vận hành
                            </p>
                        </div>
                        {/* Team Member 3 */}
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-light)]/10">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 32 32">
                                    <path
                                        d="M26.6667 28V25.3333C26.6667 23.9188 26.1048 22.5623 25.1046 21.5621C24.1044 20.5619 22.7478 20 21.3333 20H10.6667C9.25218 20 7.89562 20.5619 6.89543 21.5621C5.89524 22.5623 5.33333 23.9188 5.33333 25.3333V28"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                    <path
                                        d="M16 14.6667C18.9455 14.6667 21.3333 12.2789 21.3333 9.33333C21.3333 6.38781 18.9455 4 16 4C13.0545 4 10.6667 6.38781 10.6667 9.33333C10.6667 12.2789 13.0545 14.6667 16 14.6667Z"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                </svg>
                            </div>
                            <h4 className="mb-1 text-base font-bold text-[var(--text-primary)]">
                                Lê Văn C
                            </h4>
                            <p className="text-sm leading-5 text-[var(--text-secondary)]">
                                Giám đốc kỹ thuật
                            </p>
                        </div>
                        {/* Team Member 4 */}
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-light)]/10">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 32 32">
                                    <path
                                        d="M26.6667 28V25.3333C26.6667 23.9188 26.1048 22.5623 25.1046 21.5621C24.1044 20.5619 22.7478 20 21.3333 20H10.6667C9.25218 20 7.89562 20.5619 6.89543 21.5621C5.89524 22.5623 5.33333 23.9188 5.33333 25.3333V28"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                    <path
                                        d="M16 14.6667C18.9455 14.6667 21.3333 12.2789 21.3333 9.33333C21.3333 6.38781 18.9455 4 16 4C13.0545 4 10.6667 6.38781 10.6667 9.33333C10.6667 12.2789 13.0545 14.6667 16 14.6667Z"
                                        stroke="var(--primary-light)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.66667"
                                    />
                                </svg>
                            </div>
                            <h4 className="mb-1 text-base font-bold text-[var(--text-primary)]">
                                Phạm Thị D
                            </h4>
                            <p className="text-sm leading-5 text-[var(--text-secondary)]">
                                Giám đốc CSKH
                            </p>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="mb-12 rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 shadow-sm">
                    <div className="mb-[30px]">
                        <div className="mb-1.5 flex items-center gap-2">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path
                                    d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M22 4L12 14.01l-3-3"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                            </svg>
                            <h2 className="text-base font-bold text-[var(--text-primary)]">
                                Vì Sao Chọn FUBABus?
                            </h2>
                        </div>
                        <p className="leading-6 text-[var(--text-secondary)]">
                            Những lợi ích tuyệt vời khi lựa chọn dịch vụ của chúng tôi
                        </p>
                    </div>
                    <div className="mt-[30px] flex flex-col gap-4">
                        {[
                            "Hệ thống đặt vé trực tuyến dễ dàng, tiện lợi",
                            "Tài xế có chứng nhận, nhiều năm kinh nghiệm",
                            "Quy trình bảo dưỡng xe khắt khe",
                            "Chính sách hoàn vé dễ dàng",
                            "Dịch vụ khách hàng 24/7",
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 20 20">
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="9"
                                        stroke="var(--stat-green-text)"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M6 10L9 13L14 7"
                                        stroke="var(--stat-green-text)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                    />
                                </svg>
                                <span className="text-base leading-6 text-[var(--text-primary)]">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Awards */}
                <div className="mb-12 rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 shadow-sm">
                    <div className="mb-[30px]">
                        <div className="mb-1.5 flex items-center gap-2">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path
                                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                    stroke="var(--primary-light)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                            </svg>
                            <h2 className="text-base font-bold text-[var(--text-primary)]">
                                Giải Thưởng & Chứng Nhận
                            </h2>
                        </div>
                        <p className="leading-6 text-[var(--text-secondary)]">
                            Những thành tựu đạt được trong quá trình phát triển
                        </p>
                    </div>
                    <div className="mt-[30px] grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Award 1 */}
                        <div className="text-center">
                            <div className="mx-auto mb-4 h-20 w-20">
                                <svg fill="none" viewBox="0 0 80 80" className="h-full w-full">
                                    <path
                                        d="M40 6.66666L47.6 28.28L70 30.3333L55 44.8L58.2 66.8L40 55.6L21.8 66.8L25 44.8L10 30.3333L32.4 28.28L40 6.66666Z"
                                        stroke="var(--stat-orange-text)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="4"
                                    />
                                </svg>
                            </div>
                            <h4 className="mb-1 text-base font-bold text-[var(--text-primary)]">
                                Top 10 Doanh Nghiệp
                            </h4>
                            <p className="text-sm leading-5 text-[var(--text-secondary)]">
                                Năm 2023 - 2025
                            </p>
                        </div>

                        {/* Award 2 */}
                        <div className="text-center">
                            <div className="mx-auto mb-4 h-20 w-20">
                                <svg fill="none" viewBox="0 0 80 80" className="h-full w-full">
                                    <path
                                        d="M40 70C56.5685 70 70 56.5685 70 40C70 23.4315 56.5685 10 40 10C23.4315 10 10 23.4315 10 40C10 56.5685 23.4315 70 40 70Z"
                                        stroke="var(--stat-blue-text)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="4"
                                    />
                                    <path
                                        d="M28 40L36 48L52 28"
                                        stroke="var(--stat-blue-text)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="4"
                                    />
                                </svg>
                            </div>
                            <h4 className="mb-1 text-base font-bold text-[var(--text-primary)]">
                                ISO 9001:2015
                            </h4>
                            <p className="text-sm leading-5 text-[var(--text-secondary)]">
                                Chất lượng dịch vụ
                            </p>
                        </div>

                        {/* Award 3 */}
                        <div className="text-center">
                            <div className="mx-auto mb-4 h-20 w-20">
                                <svg fill="none" viewBox="0 0 80 80" className="h-full w-full">
                                    <path
                                        d="M40 10L50 30L70 33.3333L55 48L58.3333 68.3333L40 57L21.6667 68.3333L25 48L10 33.3333L30 30L40 10Z"
                                        stroke="var(--stat-green-text)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="4"
                                    />
                                    <circle
                                        cx="40"
                                        cy="40"
                                        r="10"
                                        stroke="var(--stat-green-text)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="4"
                                    />
                                </svg>
                            </div>
                            <h4 className="mb-1 text-base font-bold text-[var(--text-primary)]">
                                5 Sao Chất Lượng
                            </h4>
                            <p className="text-sm leading-5 text-[var(--text-secondary)]">
                                Hiệp hội Vận tải VN
                            </p>
                        </div>
                    </div>
                </div>

                {/* Commitment */}
                <div className="rounded-[14px] border border-[var(--border-gray)] bg-[var(--background-paper)] p-6 text-center shadow-sm">
                    <div className="mx-auto mb-6 h-16 w-16">
                        <svg fill="none" viewBox="0 0 64 64">
                            <path
                                d="M10.6667 16V32"
                                stroke="var(--primary-light)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="4"
                            />
                            <path
                                d="M20 16V32"
                                stroke="var(--primary-light)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="4"
                            />
                            <path
                                d="M2.66667 32H28.8"
                                stroke="var(--primary-light)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="4"
                            />
                            <path
                                d="M4 32L8 8H24L28 32"
                                stroke="var(--primary-light)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="4"
                            />
                            <path
                                d="M4 32V56C4 56.7072 4.28095 57.3855 4.78105 57.8856C5.28115 58.3857 5.95942 58.6667 6.66667 58.6667H26.6667C27.3739 58.6667 28.0522 58.3857 28.5523 57.8856C29.0524 57.3855 29.3333 56.7072 29.3333 56V32"
                                stroke="var(--primary-light)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="4"
                            />
                            <path
                                d="M12 48H18.6667"
                                stroke="var(--primary-light)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="4"
                            />
                            <path
                                d="M14.6667 40V56"
                                stroke="var(--primary-light)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="4"
                            />
                        </svg>
                    </div>
                    <h2 className="mb-4 text-lg font-bold leading-7 text-[var(--text-primary)]">
                        Cam Kết Của Chúng Tôi
                    </h2>
                    <p className="mx-auto mb-6 max-w-[768px] text-base leading-6 text-[var(--text-secondary)]">
                        BusTicket cam kết mang đến dịch vụ vận chuyển hành khách an toàn,
                        đúng giờ và chất lượng cao. Chúng tôi luôn đặt sự hài lòng của khách
                        hàng lên hàng đầu, không ngừng cải tiến và phát triển để xứng đáng
                        với sự tin tưởng của quý khách trong suốt hành trình di chuyển của
                        mình.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {["An toàn", "Đúng giờ", "Chất lượng", "Uy tín"].map(
                            (badge, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-lg border border-[var(--border-gray)] bg-[var(--bg-beige)] px-4 py-2 text-sm text-[var(--text-primary)]"
                                >
                                    {badge}
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;