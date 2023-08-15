import React, { useState, useEffect } from "react";
import { Flex, Text, Button, Box, Input} from "@chakra-ui/react";
import {
    FaArrowLeft,
    FaArrowRight,
} from "react-icons/fa";
import styles from "@/styles/paganation.module.css"

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    const showPages = 5; 
    const [inputPage, setInputPage] = useState<number | string>(currentPage);

    useEffect(() => {
        setInputPage(currentPage.toString());
    }, [currentPage]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setInputPage(inputValue);
    };

    const handleGoToPage = () => {
        const pageNumber = parseInt(inputPage as string, 10);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
            handlePageChange(pageNumber);
        }
    };

    const handlePageChange = (newPage: number) => {
        onPageChange(newPage);
    };

    let startPage = Math.max(currentPage - Math.floor(showPages / 2), 1);
    let endPage = Math.min(startPage + showPages - 1, totalPages);

    if (endPage - startPage < showPages - 1) {
        if (startPage === 1) {
            endPage = Math.min(showPages, totalPages);
        } else {
            startPage = Math.max(endPage - showPages + 1, 1);
        }
    }

    const pageNumbers: (number | string | JSX.Element)[] = [];

    if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
            pageNumbers.push(<>&hellip;</>);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers.push(<>&hellip;</>);
        }
        pageNumbers.push(totalPages);
    }

    return (
        <Flex justify="flex-end" mt={1} width={"100%"} wrap={"wrap"}>
            <Button
                isDisabled={isFirstPage}
                onClick={() => handlePageChange(currentPage - 1)}
                size="xs"
            >
                <FaArrowLeft className={styles.FaArrowLeft} />
            </Button>

            {pageNumbers.map((pageNumber, index) => (
                <Box key={index}>
                    <Button
                        onClick={() => {
                            if (typeof pageNumber === "number") {
                                handlePageChange(pageNumber);
                            }
                        }}
                        size="xs"
                        bgColor={currentPage === pageNumber ? "#3864E7" : "white"}
                        ml={2}
                        textColor={currentPage === pageNumber ? "white" : "gray"}
                        _hover={{
                            border: currentPage === pageNumber ? '0px solid #3864E7' : '1px solid #878ca8'
                        }}
                        isDisabled={currentPage === pageNumber}
                    >
                        {pageNumber}
                    </Button>
                </Box>
            ))}

            <Button
                isDisabled={isLastPage}
                onClick={() => handlePageChange(currentPage + 1)}
                size="xs"
            >
                <FaArrowRight fontSize={12} />
            </Button>


            <Box boxSize="xs" display={"flex"} height={"40px"} width={"200px"} px={2}>
                <Text size="xs" color={"#878ca8"}> Go To Page</Text>
                <Input
                    type="number"
                    value={inputPage}
                    onChange={handleInputChange}
                    min={1}
                    max={totalPages}
                    size="xs"
                    width={"40px"}
                    marginLeft={"12px"}
                    fontFamily={"Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol"}
                />
                <Button
                    size="xs"
                    onClick={handleGoToPage}
                    marginLeft={"12px"}
                >
                    Go
                </Button>

            </Box>

        </Flex>
    );
};

export default Pagination;
