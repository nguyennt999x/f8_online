import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  FormControlLabel,
  Radio,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

type Question = {
  id: number;
  text: string;
  answers: string[];
};

const EXAM_SECONDS = 10 * 60;

const questions: Question[] = [
  {
    id: 1,
    text: 'Khái niệm "đường bộ" được hiểu như thế nào là đúng?',
    answers: [
      'Đường, cầu đường bộ.',
      'Hầm đường bộ, bến phà đường bộ.',
      'Đường, cầu đường bộ, hầm đường bộ, bến phà đường bộ và các công trình phụ trợ.',
    ],
  },
  {
    id: 2,
    text: 'Người điều khiển phương tiện tham gia giao thông đường bộ phải mang theo giấy tờ nào?',
    answers: [
      'Giấy phép lái xe phù hợp với loại xe đang điều khiển.',
      'Chỉ cần căn cước công dân.',
      'Chỉ cần giấy đăng ký xe.',
      'Không cần mang giấy tờ nếu đi trong nội thành.',
    ],
  },
  {
    id: 3,
    text: 'Khi gặp đèn tín hiệu giao thông màu đỏ, người lái xe phải làm gì?',
    answers: [
      'Tiếp tục đi nếu đường vắng.',
      'Dừng lại trước vạch dừng.',
      'Bấm còi rồi đi chậm qua giao lộ.',
    ],
  },
  {
    id: 4,
    text: 'Khi chuyển hướng, người lái xe cần thực hiện thao tác nào?',
    answers: [
      'Quan sát, giảm tốc độ và bật tín hiệu báo hướng rẽ.',
      'Chỉ cần bật tín hiệu báo hướng rẽ.',
      'Chuyển hướng ngay khi thấy khoảng trống.',
      'Tăng tốc để vượt qua nhanh.',
    ],
  },
  {
    id: 5,
    text: 'Người lái xe phải giảm tốc độ trong trường hợp nào?',
    answers: [
      'Khi đi qua khu vực đông dân cư, trường học hoặc nơi đường giao nhau.',
      'Chỉ khi trời mưa rất to.',
      'Chỉ khi có cảnh sát giao thông.',
    ],
  },
];

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
};

function GplxExamPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_SECONDS);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const currentQuestion = questions[currentIndex];
  const answeredCount = useMemo(
    () => Object.keys(selectedAnswers).length,
    [selectedAnswers],
  );

  const handleSubmit = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(0);
    setSubmitted(true);
    setSuccessMessage('Nộp bài thành công!');
  };

  useEffect(() => {
    if (submitted || timeLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [submitted, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleSelectAnswer = (answerIndex: number) => {
    if (submitted) {
      return;
    }

    setSuccessMessage('');
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerIndex,
    }));
  };

  const selectedAnswer = selectedAnswers[currentQuestion.id];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f7f8fb' }}>
      <Box
        component="header"
        sx={{
          backgroundColor: '#2f66df',
          color: '#fff',
          py: 2.25,
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)',
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between' }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Ôn Thi GPLX
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.76)', fontWeight: 600 }}>
                Đề thi ngẫu nhiên số 1
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
              <Box
                sx={{
                  px: 2,
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  borderRadius: 2,
                  backgroundColor: '#2456c5',
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                <span aria-hidden="true">◷</span>
                {formatTime(timeLeft)}
              </Box>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                disabled={submitted}
                sx={{ minWidth: 104, borderRadius: 2, fontWeight: 800, textTransform: 'none' }}
              >
                Nộp bài
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Button
          component={RouterLink}
          to="/"
          variant="outlined"
          sx={{ mb: 2, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
        >
          ← Back về trang chính
        </Button>

        {successMessage ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        ) : null}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 330px' },
            gap: 3,
          }}
        >
          <Box
            sx={{
              p: { xs: 2, sm: 4 },
              minHeight: 330,
              borderRadius: 2,
              backgroundColor: '#fff',
              boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)',
              border: '1px solid #edf0f5',
            }}
          >
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
                <Box
                  sx={{
                    px: 1.75,
                    py: 0.75,
                    width: 'fit-content',
                    borderRadius: 1,
                    backgroundColor: '#e9f2ff',
                    color: '#2463d6',
                    fontWeight: 800,
                  }}
                >
                  Câu {currentQuestion.id}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#202939' }}>
                  {currentQuestion.text}
                </Typography>
              </Stack>

              <Stack spacing={1.75}>
                {currentQuestion.answers.map((answer, answerIndex) => {
                  const checked = selectedAnswer === answerIndex;

                  return (
                    <Box
                      key={answer}
                      onClick={() => handleSelectAnswer(answerIndex)}
                      sx={{
                        px: 2,
                        py: 1.5,
                        border: '2px solid',
                        borderColor: checked ? '#2f66df' : '#e4e7ec',
                        borderRadius: 1.5,
                        backgroundColor: checked ? '#eef5ff' : '#fff',
                        cursor: submitted ? 'not-allowed' : 'pointer',
                        transition: '0.16s ease',
                      }}
                    >
                      <FormControlLabel
                        disabled={submitted}
                        checked={checked}
                        control={<Radio />}
                        label={
                          <Typography sx={{ color: '#3f4654', fontWeight: checked ? 800 : 600 }}>
                            {answer}
                          </Typography>
                        }
                        onChange={() => handleSelectAnswer(answerIndex)}
                        sx={{ m: 0, width: '100%' }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </Stack>
          </Box>

          <Box
            sx={{
              p: 2,
              backgroundColor: '#fff',
              borderLeft: { md: '1px solid #edf0f5' },
              borderRadius: { xs: 2, md: 0 },
              minHeight: 420,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
              <Button
                variant="contained"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((value) => Math.max(value - 1, 0))}
                sx={{
                  flex: 1,
                  minHeight: 48,
                  borderRadius: 1.5,
                  backgroundColor: '#eef1f5',
                  color: '#697386',
                  boxShadow: 'none',
                  textTransform: 'none',
                  fontWeight: 800,
                  '&:hover': { backgroundColor: '#e4e8ef', boxShadow: 'none' },
                }}
              >
                ‹ Câu trước
              </Button>
              <Button
                variant="contained"
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex((value) => Math.min(value + 1, questions.length - 1))}
                sx={{
                  flex: 1,
                  minHeight: 48,
                  borderRadius: 1.5,
                  backgroundColor: '#eef1f5',
                  color: '#3f4654',
                  boxShadow: 'none',
                  textTransform: 'none',
                  fontWeight: 800,
                  '&:hover': { backgroundColor: '#e4e8ef', boxShadow: 'none' },
                }}
              >
                Câu tiếp ›
              </Button>
            </Stack>

            <Typography sx={{ mb: 1.5, color: '#606a7b', fontWeight: 900 }}>
              DANH SÁCH CÂU HỎI
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 48px)', gap: 1 }}>
              {questions.map((question, index) => {
                const isCurrent = index === currentIndex;
                const isAnswered = selectedAnswers[question.id] !== undefined;

                return (
                  <Button
                    key={question.id}
                    onClick={() => setCurrentIndex(index)}
                    sx={{
                      minWidth: 48,
                      height: 48,
                      borderRadius: 1.5,
                      border: '2px solid',
                      borderColor: isCurrent ? '#df9a63' : 'transparent',
                      backgroundColor: isAnswered ? '#eaf1ff' : '#f1f3f6',
                      color: '#46505f',
                      fontWeight: 800,
                      '&:hover': {
                        backgroundColor: isAnswered ? '#dde9ff' : '#e7ebf0',
                      },
                    }}
                  >
                    {question.id}
                  </Button>
                );
              })}
            </Box>

            <Stack spacing={1.25} sx={{ mt: 3, color: '#667085', fontWeight: 700 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: 0.75, backgroundColor: '#f1f3f6' }} />
                ⬜ Chưa trả lời
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: 0.75, backgroundColor: '#eaf1ff' }} />
                ✅ Đã trả lời ({answeredCount}/{questions.length})
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: 0.75,
                    border: '2px solid #df9a63',
                  }}
                />
                Đang chọn
              </Box>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default GplxExamPage;
