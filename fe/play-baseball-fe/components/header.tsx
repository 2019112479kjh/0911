import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Box, Button, Toolbar, Typography,} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import {MEMBER_LOGOUT, SERVER_URL} from "@/constants/endpoints";
import SearchBar from "./SearchBar";
import Wrapper from "./Wrapper";
import axiosInstance, {handleApiError} from "./axiosInstance";

const Header: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem("Authorization");
            setLoggedIn(!!token);
        };

        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axiosInstance.post(MEMBER_LOGOUT, {}, {withCredentials: true});
            if (response.status === 200) {
                localStorage.removeItem("Authorization");
                delete axiosInstance.defaults.headers.common['Authorization'];
                setLoggedIn(false);
                window.location.href = SERVER_URL;
            } else {
                throw new Error("로그아웃 처리 중 오류가 발생했습니다.");
            }
        } catch (error) {
            handleApiError(error);
            router.push({
                pathname: "/result",
                query: {
                    isSuccess: "false",
                    message: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
                    buttonText: "메인 페이지로 돌아가기",
                    buttonAction: "/",
                },
            });
        }
    };

    const handleSearch = (input: string) => {
        // 검색 API 호출 로직을 여기에 추가하세요.
        console.log("Search input:", input);
    }

    return (
        <Wrapper>
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 0,
                }}
            >
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        fontFamily: "Pretendard",
                        color: "#000",
                    }}
                >
                    <Link href="/" passHref>
                        <HomeIcon sx={{color: "#000"}}/>
                    </Link>
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexGrow: 2,
                        justifyContent: "center",
                        mx: 2,
                    }}
                >
                    <SearchBar onSearch={handleSearch}/>
                </Box>

                <Box sx={{display: "flex", gap: 2}}>
                    {loggedIn ? (
                        <Button
                            onClick={handleLogout}
                            sx={{color: "#000", fontFamily: "Pretendard"}}
                        >
                            로그아웃
                        </Button>
                    ) : (
                        <Link href="/login" passHref>
                            <Button sx={{color: "#000", fontFamily: "Pretendard"}}>
                                로그인
                            </Button>
                        </Link>
                    )}
                    <Link href="/exchange/write" passHref>
                        <Button sx={{color: "#000", fontFamily: "Pretendard"}}>
                            판매하기
                        </Button>
                    </Link>
                    <Link href="/chat" passHref>
                        <Button sx={{color: "#000", fontFamily: "Pretendard"}}>
                            채팅하기
                        </Button>
                    </Link>
                    <Link href="/my" passHref>
                        <Button sx={{color: "#000", fontFamily: "Pretendard"}}>
                            마이페이지
                        </Button>
                    </Link>
                </Box>
            </Toolbar>
        </Wrapper>
    );
};

export default Header;