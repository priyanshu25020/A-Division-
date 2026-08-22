const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const defaultHashedPassword = bcrypt.hashSync('ldrp123', salt);

// 1. Mentors
const mentors = [
  {
    id: "mentor-1",
    roll_no: "FAC-01",
    enrollment_no: "LDRP-FAC-001",
    full_name: "Prof. Avani Patel",
    email: "avani.patel@ldrp.ac.in",
    phone: "9876543210",
    role: "MENTOR",
    designation: "Assistant Professor & CE-A Mentor",
    department: "Computer Engineering",
    group_id: null,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "mentor-2",
    roll_no: "FAC-02",
    enrollment_no: "LDRP-FAC-002",
    full_name: "Dr. Hitsh Barot",
    email: "hitsh.barot@ldrp.ac.in",
    phone: "9876543211",
    role: "MENTOR",
    designation: "Associate Professor & CE-A Mentor",
    department: "Computer Engineering",
    group_id: null,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
  }
];

// 2. Class Groups & Coordinators
const groups = [
  {
    id: 1,
    group_number: 1,
    name: "Group 1 (Roll 1 - 10)",
    roll_range: "1 - 10",
    coordinator_name: "Vyom Bhatt",
    coordinator_roll: "25",
    color: "#10b981", // Emerald
    badge: "G1",
    total_students: 10
  },
  {
    id: 2,
    group_number: 2,
    name: "Group 2 (Roll 11 - 20)",
    roll_range: "11 - 20",
    coordinator_name: "Kavya Barot",
    coordinator_roll: "15",
    color: "#f59e0b", // Amber
    badge: "G2",
    total_students: 10
  },
  {
    id: 3,
    group_number: 3,
    name: "Group 3 (Roll 21 - 30)",
    roll_range: "21 - 30",
    coordinator_name: "Pushti Bhalani",
    coordinator_roll: "18",
    color: "#3b82f6", // Blue
    badge: "G3",
    total_students: 10
  },
  {
    id: 4,
    group_number: 4,
    name: "Group 4 (Roll 31 - 40)",
    roll_range: "31 - 40",
    coordinator_name: "Kishan Bhoraniya",
    coordinator_roll: "26",
    color: "#06b6d4", // Cyan
    badge: "G4",
    total_students: 10
  },
  {
    id: 5,
    group_number: 5,
    name: "Group 5 (Roll 41 - 50)",
    roll_range: "41 - 50",
    coordinator_name: "Zarna Chavda",
    coordinator_roll: "47",
    color: "#ec4899", // Pink
    badge: "G5",
    total_students: 10
  },
  {
    id: 6,
    group_number: 6,
    name: "Group 6 (Roll 51 - 60)",
    roll_range: "51 - 60",
    coordinator_name: "Ananya Buddham",
    coordinator_roll: "30",
    color: "#8b5cf6", // Violet
    badge: "G6",
    total_students: 10
  },
  {
    id: 7,
    group_number: 7,
    name: "Group 7 (Roll 61 - 70)",
    roll_range: "61 - 70",
    coordinator_name: "Neel Brahmbhatt",
    coordinator_roll: "29",
    color: "#6366f1", // Indigo
    badge: "G7",
    total_students: 10
  },
  {
    id: 8,
    group_number: 8,
    name: "Group 8 (D2D-CE-01 to 08 & 326)",
    roll_range: "D2D & 326",
    coordinator_name: "Nemish Ruparel",
    coordinator_roll: "D2D-CE-03",
    color: "#a855f7", // Purple
    badge: "G8",
    total_students: 9
  }
];

// Exact 78 Students from the Official Class Chart
const rawStudents = [
  // Group 1 (Roll 1 - 10)
  { roll_no: "1", enrollment_no: "25BECE30001", full_name: "AAL ANAND L.", group_id: 1, phone: "9879000001" },
  { roll_no: "2", enrollment_no: "25BECE30002", full_name: "ACHARYA SANJANA R.", group_id: 1, phone: "9879000002" },
  { roll_no: "3", enrollment_no: "25BECE30003", full_name: "ADROJA HARSH K.", group_id: 1, phone: "9879000003" },
  { roll_no: "4", enrollment_no: "25BECE30004", full_name: "ADROJA KRISHNABEN K.", group_id: 1, phone: "9879000004" },
  { roll_no: "5", enrollment_no: "25BECE30005", full_name: "ADROJA YASHVI P.", group_id: 1, phone: "9879000005" },
  { roll_no: "6", enrollment_no: "25BECE30006", full_name: "AHIR SMITH U.", group_id: 1, phone: "9879000006" },
  { roll_no: "7", enrollment_no: "25BECE30007", full_name: "ARDESHANA HETVI R.", group_id: 1, phone: "9879000007" },
  { roll_no: "8", enrollment_no: "25BECE30008", full_name: "BADGA ASHISH K.", group_id: 1, phone: "9879000008" },
  { roll_no: "9", enrollment_no: "25BECE30009", full_name: "BALDANIYA HET K.", group_id: 1, phone: "9879000009" },
  { roll_no: "10", enrollment_no: "25BECE30010", full_name: "BALDANIYA PRANJAL H.", group_id: 1, phone: "9879000010" },

  // Group 2 (Roll 11 - 20)
  { roll_no: "11", enrollment_no: "25BECE30011", full_name: "BALDHA NEEVA S.", group_id: 2, phone: "9879000011" },
  { roll_no: "12", enrollment_no: "25BECE30012", full_name: "BANKER KHYATI H.", group_id: 2, phone: "9879000012" },
  { roll_no: "13", enrollment_no: "25BECE30013", full_name: "BARAD PRABHAT M.", group_id: 2, phone: "9879000013" },
  { roll_no: "14", enrollment_no: "25BECE30014", full_name: "BARADIYA SHUBHAM R.", group_id: 2, phone: "9879000014" },
  { roll_no: "15", enrollment_no: "25BECE30015", full_name: "BAROT KAVYA S.", group_id: 2, phone: "9879000015", is_group_coord: true },
  { roll_no: "16", enrollment_no: "25BECE30016", full_name: "BAROT KRISHNA S.", group_id: 2, phone: "9879000016" },
  { roll_no: "17", enrollment_no: "25BECE30017", full_name: "BAROT VIDHIBEN A.", group_id: 2, phone: "9879000017" },
  { roll_no: "18", enrollment_no: "25BECE30018", full_name: "BHALANI PUSHTIBEN J.", group_id: 2, phone: "9879000018", is_group_coord: true, coord_group_id: 3 },
  { roll_no: "19", enrollment_no: "25BECE30019", full_name: "BHANDERI MAITRI M.", group_id: 2, phone: "9879000019" },
  { roll_no: "20", enrollment_no: "25BECE30020", full_name: "PRIYANSHU BHARADAVA", group_id: 2, phone: "9879000020", is_class_coord: true },

  // Group 3 (Roll 21 - 30)
  { roll_no: "21", enrollment_no: "25BECE30021", full_name: "BHARADVA HARSH S.", group_id: 3, phone: "9879000021" },
  { roll_no: "22", enrollment_no: "25BECE30022", full_name: "BHATIYA PRESSHA B.", group_id: 3, phone: "9879000022" },
  { roll_no: "23", enrollment_no: "25BECE30023", full_name: "HEMANGI AMIT BHATT", group_id: 3, phone: "9879000023" },
  { roll_no: "24", enrollment_no: "25BECE30024", full_name: "BHATT PRATHAM D.", group_id: 3, phone: "9879000024" },
  { roll_no: "25", enrollment_no: "25BECE30025", full_name: "BHATT VYOM R.", group_id: 3, phone: "9879000025", is_group_coord: true, coord_group_id: 1 },
  { roll_no: "26", enrollment_no: "25BECE30026", full_name: "BHORANIYA KISHAN D.", group_id: 3, phone: "9879000026", is_group_coord: true, coord_group_id: 4 },
  { roll_no: "27", enrollment_no: "25BECE30027", full_name: "BHUT EVA S.", group_id: 3, phone: "9879000027" },
  { roll_no: "28", enrollment_no: "25BECE30028", full_name: "BODA HIT S.", group_id: 3, phone: "9879000028" },
  { roll_no: "29", enrollment_no: "25BECE30029", full_name: "BRAHMBHATT NEEL K.", group_id: 3, phone: "9879000029", is_group_coord: true, coord_group_id: 7 },
  { roll_no: "30", enrollment_no: "25BECE30030", full_name: "BUDDH ANANYA R.", group_id: 3, phone: "9879000030", is_group_coord: true, coord_group_id: 6 },

  // Group 4 (Roll 31 - 40)
  { roll_no: "31", enrollment_no: "25BECE30031", full_name: "CHADOTRA PRIYANSHU D.", group_id: 4, phone: "9879000031" },
  { roll_no: "32", enrollment_no: "25BECE30032", full_name: "CHAPADIA DHRUVEN S.", group_id: 4, phone: "9879000032" },
  { roll_no: "33", enrollment_no: "25BECE30033", full_name: "CHAUDHARI KRIVI V.", group_id: 4, phone: "9879000033" },
  { roll_no: "34", enrollment_no: "25BECE30034", full_name: "CHAUDHARI MAHARSHI A.", group_id: 4, phone: "9879000034" },
  { roll_no: "35", enrollment_no: "25BECE30035", full_name: "CHAUDHARI NISARG A.", group_id: 4, phone: "9879000035" },
  { roll_no: "36", enrollment_no: "25BECE30036", full_name: "CHAUDHARY ARYANKUMAR G.", group_id: 4, phone: "9879000036" },
  { roll_no: "37", enrollment_no: "25BECE30037", full_name: "CHAUDHARY HARSH M.", group_id: 4, phone: "9879000037" },
  { roll_no: "38", enrollment_no: "25BECE30038", full_name: "CHAUDHARY RIYABEN S.", group_id: 4, phone: "9879000038" },
  { roll_no: "39", enrollment_no: "25BECE30039", full_name: "CHAUHAN HIMESH J.", group_id: 4, phone: "9879000039" },
  { roll_no: "40", enrollment_no: "25BECE30040", full_name: "CHAUHAN JIMESHKUMAR R.", group_id: 4, phone: "9879000040" },

  // Group 5 (Roll 41 - 50)
  { roll_no: "41", enrollment_no: "25BECE30041", full_name: "CHAUHAN PRADIPSINH B.", group_id: 5, phone: "9879000041" },
  { roll_no: "42", enrollment_no: "25BECE30042", full_name: "CHAUHAN PRIYARAJSINH V.", group_id: 5, phone: "9879000042" },
  { roll_no: "43", enrollment_no: "25BECE30043", full_name: "CHAUHAN SHIVAM P.", group_id: 5, phone: "9879000043" },
  { roll_no: "44", enrollment_no: "25BECE30044", full_name: "HELI CHAVDA", group_id: 5, phone: "9879000044" },
  { roll_no: "45", enrollment_no: "25BECE30045", full_name: "CHAVDA HETVI L.", group_id: 5, phone: "9879000045" },
  { roll_no: "46", enrollment_no: "25BECE30046", full_name: "CHAVDA KRISH R.", group_id: 5, phone: "9879000046" },
  { roll_no: "47", enrollment_no: "25BECE30047", full_name: "CHAVDA ZARNA R.", group_id: 5, phone: "9879000047", is_group_coord: true, coord_group_id: 5 },
  { roll_no: "48", enrollment_no: "25BECE30048", full_name: "DABHI BHARDWAJBHAI D.", group_id: 5, phone: "9879000048" },
  { roll_no: "49", enrollment_no: "25BECE30049", full_name: "DABHI CHRIS MANISH", group_id: 5, phone: "9879000049" },
  { roll_no: "50", enrollment_no: "25BECE30050", full_name: "PURVA BHARAT DABHI", group_id: 5, phone: "9879000050" },

  // Group 6 (Roll 51 - 60)
  { roll_no: "51", enrollment_no: "25BECE30051", full_name: "DADHANIYA RITU C.", group_id: 6, phone: "9879000051" },
  { roll_no: "52", enrollment_no: "25BECE30052", full_name: "DAHIMA MIHIR M.", group_id: 6, phone: "9879000052" },
  { roll_no: "53", enrollment_no: "25BECE30053", full_name: "DALVADI ASMITABEN J.", group_id: 6, phone: "9879000053" },
  { roll_no: "54", enrollment_no: "25BECE30054", full_name: "DARJI DIKSHANTKUMAR B.", group_id: 6, phone: "9879000054" },
  { roll_no: "55", enrollment_no: "25BECE30055", full_name: "DARJI KRIPAL K.", group_id: 6, phone: "9879000055" },
  { roll_no: "56", enrollment_no: "25BECE30056", full_name: "DARJI VINITKUMAR R.", group_id: 6, phone: "9879000056" },
  { roll_no: "57", enrollment_no: "25BECE30057", full_name: "DASADIYA BHAVYA G.", group_id: 6, phone: "9879000057" },
  { roll_no: "58", enrollment_no: "25BECE30058", full_name: "DAVE RUDRA K.", group_id: 6, phone: "9879000058" },
  { roll_no: "59", enrollment_no: "25BECE30059", full_name: "DAVE SALONI H.", group_id: 6, phone: "9879000059" },
  { roll_no: "60", enrollment_no: "25BECE30060", full_name: "DAVE SAUMYA P.", group_id: 6, phone: "9879000060" },

  // Group 7 (Roll 61 - 70)
  { roll_no: "61", enrollment_no: "25BECE30061", full_name: "DESAI CHEHAR N.", group_id: 7, phone: "9879000061" },
  { roll_no: "62", enrollment_no: "25BECE30062", full_name: "DESAI PRIT M.", group_id: 7, phone: "9879000062" },
  { roll_no: "63", enrollment_no: "25BECE30063", full_name: "DETROJA PARTH J.", group_id: 7, phone: "9879000063" },
  { roll_no: "64", enrollment_no: "25BECE30064", full_name: "DHOLARIYA GREENABEN H.", group_id: 7, phone: "9879000064" },
  { roll_no: "65", enrollment_no: "25BECE30065", full_name: "PRAJAPATI DISHANT D.", group_id: 7, phone: "9879000065" },
  { roll_no: "66", enrollment_no: "25BECE30066", full_name: "DOBARIYA KRISHABEN R.", group_id: 7, phone: "9879000066" },
  { roll_no: "67", enrollment_no: "25BECE30067", full_name: "DOBARIYA MANTHAN R.", group_id: 7, phone: "9879000067" },
  { roll_no: "68", enrollment_no: "25BECE30068", full_name: "DODIYA SUMITKUMAR J.", group_id: 7, phone: "9879000068" },
  { roll_no: "69", enrollment_no: "25BECE30069", full_name: "DOSHI HETVI U.", group_id: 7, phone: "9879000069" },
  { roll_no: "70", enrollment_no: "25BECE30070", full_name: "PRAJAPATI SAKSHI V.", group_id: 7, phone: "9879000070" },

  // Group 8 (D2D-CE-01 to 08 & 326)
  { roll_no: "D2D-CE-01", enrollment_no: "25BED2D3001", full_name: "HADIYAL DARSHIL K.", group_id: 8, phone: "9879000071" },
  { roll_no: "D2D-CE-02", enrollment_no: "25BED2D3002", full_name: "CHAVDA VISHESH H.", group_id: 8, phone: "9879000072" },
  { roll_no: "D2D-CE-03", enrollment_no: "25BED2D3003", full_name: "RUPAREL NEMIS K.", group_id: 8, phone: "9879000073", is_group_coord: true, coord_group_id: 8 },
  { roll_no: "D2D-CE-04", enrollment_no: "25BED2D3004", full_name: "VORA YASHASVI D.", group_id: 8, phone: "9879000074" },
  { roll_no: "D2D-CE-05", enrollment_no: "25BED2D3005", full_name: "VORA MAHAMMADKAIF I.", group_id: 8, phone: "9879000075" },
  { roll_no: "D2D-CE-06", enrollment_no: "25BED2D3006", full_name: "SONI RUDRA R.", group_id: 8, phone: "9879000076" },
  { roll_no: "D2D-CE-07", enrollment_no: "25BED2D3007", full_name: "BAROT ADITYA S.", group_id: 8, phone: "9879000077" },
  { roll_no: "D2D-CE-08", enrollment_no: "25BED2D3008", full_name: "SAGAR YUG K.", group_id: 8, phone: "9879000078" },
  { roll_no: "326", enrollment_no: "25BECE30326", full_name: "PRAJAPATI SAKSHI V. (Lateral)", group_id: 8, phone: "9879000079" }
];

// Map students into normalized users
const studentUsers = rawStudents.map((s, idx) => {
  let role = "STUDENT";
  let coordGroupId = null;

  if (s.is_class_coord) {
    role = "CLASS_COORD";
  } else if (s.is_group_coord) {
    role = "GROUP_COORD";
    coordGroupId = s.coord_group_id || s.group_id;
  }

  const cleanName = s.full_name.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
  const email = `${cleanName}@ldrp.ac.in`;

  return {
    id: `student-${idx + 1}`,
    roll_no: s.roll_no,
    enrollment_no: s.enrollment_no,
    full_name: s.full_name,
    email: email,
    phone: s.phone,
    role: role,
    group_id: s.group_id,
    coord_group_id: coordGroupId,
    attendance_pct: Math.floor(Math.random() * (98 - 78 + 1)) + 78,
    semester: 3,
    branch: "Computer Engineering (CE-A)",
    college: "LDRP Institute of Technology and Research",
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(s.full_name)}&backgroundColor=0284c7,1e3a8a,f59e0b,10b981`
  };
});

const allUsers = [...mentors, ...studentUsers].map(u => ({
  ...u,
  password: defaultHashedPassword
}));

// Initial Sample Forms
const forms = [
  {
    id: "form-101",
    title: "Holiday Declaration: Attendance for 26th August",
    description: "Please declare your attendance status for Monday, 26th August. Mentors require exact headcount to plan laboratory practical sessions.",
    form_type: "HOLIDAY_DECLARATION",
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    created_by: "mentor-2",
    created_by_name: "Dr. Hitsh Barot",
    is_active: true,
    requires_file: false,
    questions: [
      {
        id: "q1",
        label: "Attendance Intention for 26th Aug",
        type: "select",
        options: ["I will attend college (Present)", "I will be absent", "Commuting from native/hostel (Late arrival)"],
        required: true
      },
      {
        id: "q2",
        label: "Reason if Absent / Late",
        type: "text",
        required: false
      }
    ]
  },
  {
    id: "form-102",
    title: "GTU Mid-Semester Exam Undertaking & Verification Form",
    description: "All CE-A students must verify their registered exam subjects and submit their signed undertaking form.",
    form_type: "DOCUMENT_UPLOAD",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "student-20",
    created_by_name: "Priyanshu Bharadava (CR)",
    is_active: true,
    requires_file: true,
    questions: [
      {
        id: "q1",
        label: "Have you cleared all term fee dues?",
        type: "radio",
        options: ["Yes, Paid", "Pending Receipt"],
        required: true
      },
      {
        id: "q2",
        label: "Upload Fee Receipt / Undertaking PDF",
        type: "file",
        required: true
      }
    ]
  },
  {
    id: "form-103",
    title: "Industrial Visit & Tech Expo Consent Form",
    description: "Consent from parents for the upcoming 1-day Industrial Visit to GIFT City & TCS Gandhinagar.",
    form_type: "GENERAL_SURVEY",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "mentor-1",
    created_by_name: "Prof. Avani Patel",
    is_active: true,
    requires_file: false,
    questions: [
      {
        id: "q1",
        label: "Are you participating in the Industrial Visit?",
        type: "radio",
        options: ["Yes, Confirmed", "No"],
        required: true
      },
      {
        id: "q2",
        label: "Emergency Parent Contact Number",
        type: "text",
        required: true
      }
    ]
  }
];

// Pre-fill some submissions for realism
const submissions = [
  {
    id: "sub-1",
    form_id: "form-101",
    student_id: "student-20", // Priyanshu
    student_name: "PRIYANSHU BHARADAVA",
    roll_no: "20",
    enrollment_no: "25BECE30020",
    group_id: 2,
    response_data: {
      q1: "I will attend college (Present)",
      q2: "Conducting CR duties & attending all practicals"
    },
    attachment_url: null,
    status: "APPROVED",
    submitted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sub-2",
    form_id: "form-101",
    student_id: "student-1", // Aal Anand
    student_name: "AAL ANAND L.",
    roll_no: "1",
    enrollment_no: "25BECE30001",
    group_id: 1,
    response_data: {
      q1: "I will attend college (Present)",
      q2: ""
    },
    attachment_url: null,
    status: "VERIFIED",
    submitted_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sub-3",
    form_id: "form-101",
    student_id: "student-15", // Kavya Barot
    student_name: "BAROT KAVYA S.",
    roll_no: "15",
    enrollment_no: "25BECE30015",
    group_id: 2,
    response_data: {
      q1: "I will attend college (Present)",
      q2: ""
    },
    attachment_url: null,
    status: "APPROVED",
    submitted_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sub-4",
    form_id: "form-101",
    student_id: "student-25", // Vyom Bhatt
    student_name: "BHATT VYOM R.",
    roll_no: "25",
    enrollment_no: "25BECE30025",
    group_id: 3,
    response_data: {
      q1: "I will attend college (Present)",
      q2: ""
    },
    attachment_url: null,
    status: "APPROVED",
    submitted_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sub-5",
    form_id: "form-101",
    student_id: "student-73", // Nemish Ruparel
    student_name: "RUPAREL NEMIS K.",
    roll_no: "D2D-CE-03",
    enrollment_no: "25BED2D3003",
    group_id: 8,
    response_data: {
      q1: "I will attend college (Present)",
      q2: "Attending D2D Bridge Practical"
    },
    attachment_url: null,
    status: "VERIFIED",
    submitted_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

// Announcements
const announcements = [
  {
    id: "ann-1",
    title: "🚨 URGENT: DSA Practical Session Shifted to Lab 5",
    content: "Due to server maintenance in Lab 3, today's Data Structures & Algorithms practical for all CE-A batches will be conducted in Lab 5 (Ground Floor). Please report directly with your lab journals.",
    priority: "URGENT",
    posted_by_name: "Dr. Hitsh Barot",
    posted_by_role: "Mentor",
    target_group: null,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: "ann-2",
    title: "📋 Mid-Semester Examination Timetable Published",
    content: "The mid-sem exam dates for Semester 3 have been finalized starting from 15th September. Syllabus covers Units 1, 2, and 3 for all five core subjects. Detailed schedule available in the Calendar section.",
    priority: "IMPORTANT",
    posted_by_name: "Prof. Avani Patel",
    posted_by_role: "Mentor",
    target_group: null,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ann-3",
    title: "📢 D2D Bridge Course - Mathematics-3 Tutorial Slot",
    content: "Special tutorial class for D2D students (Group 8) is scheduled on Friday at 3:30 PM in Room 204. Attendance is compulsory.",
    priority: "IMPORTANT",
    posted_by_name: "Priyanshu Bharadava (CR)",
    posted_by_role: "Class Coordinator",
    target_group: 8,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

// Leave Applications
const leaves = [
  {
    id: "leave-1",
    student_id: "student-13",
    student_name: "BARAD PRABHAT M.",
    roll_no: "13",
    group_id: 2,
    from_date: "2026-08-25",
    to_date: "2026-08-26",
    reason: "Severe viral fever, doctor advised 2 days rest.",
    medical_proof_url: null,
    coordinator_status: "VERIFIED",
    mentor_status: "APPROVED",
    applied_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "leave-2",
    student_id: "student-37",
    student_name: "CHAUDHARY HARSH M.",
    roll_no: "37",
    group_id: 4,
    from_date: "2026-08-27",
    to_date: "2026-08-28",
    reason: "Representing LDRP in Inter-College Volleyball Tournament at GTU.",
    medical_proof_url: null,
    coordinator_status: "VERIFIED",
    mentor_status: "PENDING",
    applied_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
];

// Academic Subjects & Resources
const subjects = [
  {
    id: "sub-dsa",
    code: "3130702",
    name: "Data Structures & Algorithms (DSA)",
    faculty: "Dr. Hitsh Barot",
    credits: 5,
    attendance_pct: 92,
    materials: [
      { id: "m1", title: "Unit 1: Linear Data Structures & Stacks Notes (PDF)", type: "Notes", size: "3.2 MB", url: "#" },
      { id: "m2", title: "GTU Previous 5-Year Question Papers with Solutions", type: "PYQ", size: "8.5 MB", url: "#" },
      { id: "m3", title: "Lab Practical List 1 to 14 (C/C++ Code Solutions)", type: "Code", size: "1.8 MB", url: "#" }
    ]
  },
  {
    id: "sub-dbms",
    code: "3130703",
    name: "Database Management Systems (DBMS)",
    faculty: "Prof. Avani Patel",
    credits: 5,
    attendance_pct: 88,
    materials: [
      { id: "m4", title: "Unit 2: ER-Diagrams, Relational Algebra & Normalization", type: "Notes", size: "4.1 MB", url: "#" },
      { id: "m5", title: "SQL Lab Queries & PL/SQL Trigger Cheatsheet", type: "Code", size: "2.1 MB", url: "#" },
      { id: "m6", title: "GTU DBMS Mid-Sem & Final Exam PYQs Bank", type: "PYQ", size: "6.4 MB", url: "#" }
    ]
  },
  {
    id: "sub-java",
    code: "3130704",
    name: "Object Oriented Programming using Java",
    faculty: "Prof. R. M. Sharma",
    credits: 4,
    attendance_pct: 95,
    materials: [
      { id: "m7", title: "OOPs Concepts, Multithreading & Exception Handling", type: "Notes", size: "5.0 MB", url: "#" },
      { id: "m8", title: "Java Collections Framework & GUI Swing Programs", type: "Code", size: "3.4 MB", url: "#" }
    ]
  },
  {
    id: "sub-maths",
    code: "3130006",
    name: "Probability & Statistics / Discrete Mathematics",
    faculty: "Dr. S. K. Joshi",
    credits: 4,
    attendance_pct: 81,
    materials: [
      { id: "m9", title: "Formulas Handbook: Graph Theory & Combinatorics", type: "Notes", size: "2.8 MB", url: "#" },
      { id: "m10", title: "Solved Examples & Previous Year Mid-Sem Tests", type: "PYQ", size: "7.1 MB", url: "#" }
    ]
  }
];

// Timetable
const timetable = [
  { day: "Monday", slots: [
    { time: "09:30 AM - 10:30 AM", subject: "Discrete Mathematics", room: "Room 304", faculty: "Dr. S. K. Joshi", type: "Lecture" },
    { time: "10:30 AM - 12:30 PM", subject: "DSA Lab (Batch A1 & A2)", room: "Lab 5", faculty: "Dr. Hitsh Barot", type: "Practical" },
    { time: "01:15 PM - 02:15 PM", subject: "DBMS", room: "Room 304", faculty: "Prof. Avani Patel", type: "Lecture" },
    { time: "02:15 PM - 03:15 PM", subject: "OOP using Java", room: "Room 304", faculty: "Prof. R. M. Sharma", type: "Lecture" }
  ]},
  { day: "Tuesday", slots: [
    { time: "09:30 AM - 10:30 AM", subject: "DBMS", room: "Room 304", faculty: "Prof. Avani Patel", type: "Lecture" },
    { time: "10:30 AM - 12:30 PM", subject: "DBMS Lab (Batch A1 & A2)", room: "Lab 3", faculty: "Prof. Avani Patel", type: "Practical" },
    { time: "01:15 PM - 02:15 PM", subject: "DSA Lecture", room: "Room 304", faculty: "Dr. Hitsh Barot", type: "Lecture" },
    { time: "02:15 PM - 03:15 PM", subject: "Digital Electronics", room: "Room 304", faculty: "Prof. D. K. Shah", type: "Lecture" }
  ]},
  { day: "Wednesday", slots: [
    { time: "09:30 AM - 10:30 AM", subject: "OOP using Java", room: "Room 304", faculty: "Prof. R. M. Sharma", type: "Lecture" },
    { time: "10:30 AM - 12:30 PM", subject: "Java Programming Lab", room: "Lab 2", faculty: "Prof. R. M. Sharma", type: "Practical" },
    { time: "01:15 PM - 02:15 PM", subject: "Discrete Mathematics", room: "Room 304", faculty: "Dr. S. K. Joshi", type: "Lecture" },
    { time: "02:15 PM - 03:15 PM", subject: "DSA Lecture", room: "Room 304", faculty: "Dr. Hitsh Barot", type: "Lecture" }
  ]},
  { day: "Thursday", slots: [
    { time: "09:30 AM - 10:30 AM", subject: "DSA Lecture", room: "Room 304", faculty: "Dr. Hitsh Barot", type: "Lecture" },
    { time: "10:30 AM - 11:30 AM", subject: "DBMS Lecture", room: "Room 304", faculty: "Prof. Avani Patel", type: "Lecture" },
    { time: "11:30 AM - 12:30 PM", subject: "Digital Electronics", room: "Room 304", faculty: "Prof. D. K. Shah", type: "Lecture" },
    { time: "01:15 PM - 03:15 PM", subject: "Mentoring & CR Review Session", room: "Seminar Hall 1", faculty: "Prof. Avani & Dr. Hitsh", type: "Activity" }
  ]},
  { day: "Friday", slots: [
    { time: "09:30 AM - 10:30 AM", subject: "OOP using Java", room: "Room 304", faculty: "Prof. R. M. Sharma", type: "Lecture" },
    { time: "10:30 AM - 12:30 PM", subject: "Web Development / Mini Project Lab", room: "Lab 7", faculty: "Prof. Avani Patel", type: "Practical" },
    { time: "01:15 PM - 02:15 PM", subject: "Discrete Mathematics", room: "Room 304", faculty: "Dr. S. K. Joshi", type: "Lecture" },
    { time: "02:15 PM - 03:15 PM", subject: "D2D Bridge Math Slot (Group 8)", room: "Room 204", faculty: "Dr. S. K. Joshi", type: "Tutorial" }
  ]}
];

const database = {
  users: allUsers,
  groups: groups,
  forms: forms,
  submissions: submissions,
  announcements: announcements,
  leaves: leaves,
  subjects: subjects,
  timetable: timetable,
  last_updated: new Date().toISOString()
};

const dbPath = path.join(__dirname, 'db.json');
fs.writeFileSync(dbPath, JSON.stringify(database, null, 2), 'utf-8');
console.log(`Database successfully initialized with ${allUsers.length} users (${studentUsers.length} students, 2 mentors, 8 groups) at: ${dbPath}`);
