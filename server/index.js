const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ldrp-cea-super-secure-token-secret-2026-key';

let db = {
  "users": [
    {
      "id": "mentor-1",
      "roll_no": "FAC-01",
      "enrollment_no": "LDRP-FAC-001",
      "full_name": "Prof. Avani Patel",
      "email": "avani.patel@ldrp.ac.in",
      "phone": "9876543210",
      "role": "MENTOR",
      "designation": "Assistant Professor & CE-A Mentor",
      "department": "Computer Engineering",
      "group_id": null,
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "mentor-2",
      "roll_no": "FAC-02",
      "enrollment_no": "LDRP-FAC-002",
      "full_name": "Dr. Hitsh Barot",
      "email": "hitsh.barot@ldrp.ac.in",
      "phone": "9876543211",
      "role": "MENTOR",
      "designation": "Associate Professor & CE-A Mentor",
      "department": "Computer Engineering",
      "group_id": null,
      "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-1",
      "roll_no": "1",
      "enrollment_no": "25BECE30001",
      "full_name": "AAL ANAND L.",
      "email": "aal.anand.l@ldrp.ac.in",
      "phone": "9879000001",
      "role": "STUDENT",
      "group_id": 1,
      "coord_group_id": null,
      "attendance_pct": 94,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=AAL%20ANAND%20L.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-2",
      "roll_no": "2",
      "enrollment_no": "25BECE30002",
      "full_name": "ACHARYA SANJANA R.",
      "email": "acharya.sanjana.r@ldrp.ac.in",
      "phone": "9879000002",
      "role": "STUDENT",
      "group_id": 1,
      "coord_group_id": null,
      "attendance_pct": 85,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=ACHARYA%20SANJANA%20R.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-3",
      "roll_no": "3",
      "enrollment_no": "25BECE30003",
      "full_name": "ADROJA HARSH K.",
      "email": "adroja.harsh.k@ldrp.ac.in",
      "phone": "9879000003",
      "role": "STUDENT",
      "group_id": 1,
      "coord_group_id": null,
      "attendance_pct": 90,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=ADROJA%20HARSH%20K.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-4",
      "roll_no": "4",
      "enrollment_no": "25BECE30004",
      "full_name": "ADROJA KRISHNABEN K.",
      "email": "adroja.krishnaben.k@ldrp.ac.in",
      "phone": "9879000004",
      "role": "STUDENT",
      "group_id": 1,
      "coord_group_id": null,
      "attendance_pct": 96,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=ADROJA%20KRISHNABEN%20K.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-5",
      "roll_no": "5",
      "enrollment_no": "25BECE30005",
      "full_name": "ADROJA YASHVI P.",
      "email": "adroja.yashvi.p@ldrp.ac.in",
      "phone": "9879000005",
      "role": "STUDENT",
      "group_id": 1,
      "coord_group_id": null,
      "attendance_pct": 79,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=ADROJA%20YASHVI%20P.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-6",
      "roll_no": "6",
      "enrollment_no": "25BECE30006",
      "full_name": "AHIR SMITH U.",
      "email": "ahir.smith.u@ldrp.ac.in",
      "phone": "9879000006",
      "role": "STUDENT",
      "group_id": 1,
      "coord_group_id": null,
      "attendance_pct": 82,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=AHIR%20SMITH%20U.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-7",
      "roll_no": "7",
      "enrollment_no": "25BECE30007",
      "full_name": "ARDESHANA HETVI R.",
      "email": "ardeshana.hetvi.r@ldrp.ac.in",
      "phone": "9879000007",
      "role": "STUDENT",
      "group_id": 1,
      "coord_group_id": null,
      "attendance_pct": 94,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=ARDESHANA%20HETVI%20R.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-8",
      "roll_no": "8",
      "enrollment_no": "25BECE30008",
      "full_name": "BADGA ASHISH K.",
      "email": "badga.ashish.k@ldrp.ac.in",
      "phone": "9879000008",
      "role": "STUDENT",
      "group_id": 1,
      "coord_group_id": null,
      "attendance_pct": 82,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BADGA%20ASHISH%20K.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-9",
      "roll_no": "9",
      "enrollment_no": "25BECE30009",
      "full_name": "BALDANIYA HET K.",
      "email": "baldaniya.het.k@ldrp.ac.in",
      "phone": "9879000009",
      "role": "STUDENT",
      "group_id": 1,
      "coord_group_id": null,
      "attendance_pct": 94,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BALDANIYA%20HET%20K.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-10",
      "roll_no": "10",
      "enrollment_no": "25BECE30010",
      "full_name": "BALDANIYA PRANJAL H.",
      "email": "baldaniya.pranjal.h@ldrp.ac.in",
      "phone": "9879000010",
      "role": "STUDENT",
      "group_id": 1,
      "coord_group_id": null,
      "attendance_pct": 87,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BALDANIYA%20PRANJAL%20H.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-11",
      "roll_no": "11",
      "enrollment_no": "25BECE30011",
      "full_name": "BALDHA NEEVA S.",
      "email": "baldha.neeva.s@ldrp.ac.in",
      "phone": "9879000011",
      "role": "STUDENT",
      "group_id": 2,
      "coord_group_id": null,
      "attendance_pct": 90,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BALDHA%20NEEVA%20S.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-12",
      "roll_no": "12",
      "enrollment_no": "25BECE30012",
      "full_name": "BANKER KHYATI H.",
      "email": "banker.khyati.h@ldrp.ac.in",
      "phone": "9879000012",
      "role": "STUDENT",
      "group_id": 2,
      "coord_group_id": null,
      "attendance_pct": 98,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BANKER%20KHYATI%20H.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-13",
      "roll_no": "13",
      "enrollment_no": "25BECE30013",
      "full_name": "BARAD PRABHAT M.",
      "email": "barad.prabhat.m@ldrp.ac.in",
      "phone": "9879000013",
      "role": "STUDENT",
      "group_id": 2,
      "coord_group_id": null,
      "attendance_pct": 88,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BARAD%20PRABHAT%20M.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-14",
      "roll_no": "14",
      "enrollment_no": "25BECE30014",
      "full_name": "BARADIYA SHUBHAM R.",
      "email": "baradiya.shubham.r@ldrp.ac.in",
      "phone": "9879000014",
      "role": "STUDENT",
      "group_id": 2,
      "coord_group_id": null,
      "attendance_pct": 97,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BARADIYA%20SHUBHAM%20R.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-15",
      "roll_no": "15",
      "enrollment_no": "25BECE30015",
      "full_name": "BAROT KAVYA S.",
      "email": "barot.kavya.s@ldrp.ac.in",
      "phone": "9879000015",
      "role": "GROUP_COORD",
      "group_id": 2,
      "coord_group_id": 2,
      "attendance_pct": 98,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BAROT%20KAVYA%20S.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-16",
      "roll_no": "16",
      "enrollment_no": "25BECE30016",
      "full_name": "BAROT KRISHNA S.",
      "email": "barot.krishna.s@ldrp.ac.in",
      "phone": "9879000016",
      "role": "STUDENT",
      "group_id": 2,
      "coord_group_id": null,
      "attendance_pct": 94,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BAROT%20KRISHNA%20S.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-17",
      "roll_no": "17",
      "enrollment_no": "25BECE30017",
      "full_name": "BAROT VIDHIBEN A.",
      "email": "barot.vidhiben.a@ldrp.ac.in",
      "phone": "9879000017",
      "role": "STUDENT",
      "group_id": 2,
      "coord_group_id": null,
      "attendance_pct": 80,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BAROT%20VIDHIBEN%20A.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-18",
      "roll_no": "18",
      "enrollment_no": "25BECE30018",
      "full_name": "BHALANI PUSHTIBEN J.",
      "email": "bhalani.pushtiben.j@ldrp.ac.in",
      "phone": "9879000018",
      "role": "GROUP_COORD",
      "group_id": 2,
      "coord_group_id": 3,
      "attendance_pct": 91,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BHALANI%20PUSHTIBEN%20J.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-19",
      "roll_no": "19",
      "enrollment_no": "25BECE30019",
      "full_name": "BHANDERI MAITRI M.",
      "email": "bhanderi.maitri.m@ldrp.ac.in",
      "phone": "9879000019",
      "role": "STUDENT",
      "group_id": 2,
      "coord_group_id": null,
      "attendance_pct": 93,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BHANDERI%20MAITRI%20M.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-20",
      "roll_no": "20",
      "enrollment_no": "25BECE30020",
      "full_name": "PRIYANSHU BHARADAVA",
      "email": "priyanshu.bharadava@ldrp.ac.in",
      "phone": "9879000020",
      "role": "CLASS_COORD",
      "group_id": 2,
      "coord_group_id": null,
      "attendance_pct": 94,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=PRIYANSHU%20BHARADAVA&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-21",
      "roll_no": "21",
      "enrollment_no": "25BECE30021",
      "full_name": "BHARADVA HARSH S.",
      "email": "bharadva.harsh.s@ldrp.ac.in",
      "phone": "9879000021",
      "role": "STUDENT",
      "group_id": 3,
      "coord_group_id": null,
      "attendance_pct": 91,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BHARADVA%20HARSH%20S.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-22",
      "roll_no": "22",
      "enrollment_no": "25BECE30022",
      "full_name": "BHATIYA PRESSHA B.",
      "email": "bhatiya.pressha.b@ldrp.ac.in",
      "phone": "9879000022",
      "role": "STUDENT",
      "group_id": 3,
      "coord_group_id": null,
      "attendance_pct": 94,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BHATIYA%20PRESSHA%20B.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-23",
      "roll_no": "23",
      "enrollment_no": "25BECE30023",
      "full_name": "HEMANGI AMIT BHATT",
      "email": "hemangi.amit.bhatt@ldrp.ac.in",
      "phone": "9879000023",
      "role": "STUDENT",
      "group_id": 3,
      "coord_group_id": null,
      "attendance_pct": 88,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=HEMANGI%20AMIT%20BHATT&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-24",
      "roll_no": "24",
      "enrollment_no": "25BECE30024",
      "full_name": "BHATT PRATHAM D.",
      "email": "bhatt.pratham.d@ldrp.ac.in",
      "phone": "9879000024",
      "role": "STUDENT",
      "group_id": 3,
      "coord_group_id": null,
      "attendance_pct": 78,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BHATT%20PRATHAM%20D.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-25",
      "roll_no": "25",
      "enrollment_no": "25BECE30025",
      "full_name": "BHATT VYOM R.",
      "email": "bhatt.vyom.r@ldrp.ac.in",
      "phone": "9879000025",
      "role": "GROUP_COORD",
      "group_id": 3,
      "coord_group_id": 1,
      "attendance_pct": 88,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BHATT%20VYOM%20R.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-26",
      "roll_no": "26",
      "enrollment_no": "25BECE30026",
      "full_name": "BHORANIYA KISHAN D.",
      "email": "bhoraniya.kishan.d@ldrp.ac.in",
      "phone": "9879000026",
      "role": "GROUP_COORD",
      "group_id": 3,
      "coord_group_id": 4,
      "attendance_pct": 96,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BHORANIYA%20KISHAN%20D.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-27",
      "roll_no": "27",
      "enrollment_no": "25BECE30027",
      "full_name": "BHUT EVA S.",
      "email": "bhut.eva.s@ldrp.ac.in",
      "phone": "9879000027",
      "role": "STUDENT",
      "group_id": 3,
      "coord_group_id": null,
      "attendance_pct": 88,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BHUT%20EVA%20S.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-28",
      "roll_no": "28",
      "enrollment_no": "25BECE30028",
      "full_name": "BODA HIT S.",
      "email": "boda.hit.s@ldrp.ac.in",
      "phone": "9879000028",
      "role": "STUDENT",
      "group_id": 3,
      "coord_group_id": null,
      "attendance_pct": 91,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BODA%20HIT%20S.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-29",
      "roll_no": "29",
      "enrollment_no": "25BECE30029",
      "full_name": "BRAHMBHATT NEEL K.",
      "email": "brahmbhatt.neel.k@ldrp.ac.in",
      "phone": "9879000029",
      "role": "GROUP_COORD",
      "group_id": 3,
      "coord_group_id": 7,
      "attendance_pct": 98,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BRAHMBHATT%20NEEL%20K.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-30",
      "roll_no": "30",
      "enrollment_no": "25BECE30030",
      "full_name": "BUDDH ANANYA R.",
      "email": "buddh.ananya.r@ldrp.ac.in",
      "phone": "9879000030",
      "role": "GROUP_COORD",
      "group_id": 3,
      "coord_group_id": 6,
      "attendance_pct": 80,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BUDDH%20ANANYA%20R.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-31",
      "roll_no": "31",
      "enrollment_no": "25BECE30031",
      "full_name": "CHADOTRA PRIYANSHU D.",
      "email": "chadotra.priyanshu.d@ldrp.ac.in",
      "phone": "9879000031",
      "role": "STUDENT",
      "group_id": 4,
      "coord_group_id": null,
      "attendance_pct": 93,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHADOTRA%20PRIYANSHU%20D.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-32",
      "roll_no": "32",
      "enrollment_no": "25BECE30032",
      "full_name": "CHAPADIA DHRUVEN S.",
      "email": "chapadia.dhruven.s@ldrp.ac.in",
      "phone": "9879000032",
      "role": "STUDENT",
      "group_id": 4,
      "coord_group_id": null,
      "attendance_pct": 80,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAPADIA%20DHRUVEN%20S.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-33",
      "roll_no": "33",
      "enrollment_no": "25BECE30033",
      "full_name": "CHAUDHARI KRIVI V.",
      "email": "chaudhari.krivi.v@ldrp.ac.in",
      "phone": "9879000033",
      "role": "STUDENT",
      "group_id": 4,
      "coord_group_id": null,
      "attendance_pct": 93,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAUDHARI%20KRIVI%20V.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-34",
      "roll_no": "34",
      "enrollment_no": "25BECE30034",
      "full_name": "CHAUDHARI MAHARSHI A.",
      "email": "chaudhari.maharshi.a@ldrp.ac.in",
      "phone": "9879000034",
      "role": "STUDENT",
      "group_id": 4,
      "coord_group_id": null,
      "attendance_pct": 83,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAUDHARI%20MAHARSHI%20A.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-35",
      "roll_no": "35",
      "enrollment_no": "25BECE30035",
      "full_name": "CHAUDHARI NISARG A.",
      "email": "chaudhari.nisarg.a@ldrp.ac.in",
      "phone": "9879000035",
      "role": "STUDENT",
      "group_id": 4,
      "coord_group_id": null,
      "attendance_pct": 97,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAUDHARI%20NISARG%20A.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-36",
      "roll_no": "36",
      "enrollment_no": "25BECE30036",
      "full_name": "CHAUDHARY ARYANKUMAR G.",
      "email": "chaudhary.aryankumar.g@ldrp.ac.in",
      "phone": "9879000036",
      "role": "STUDENT",
      "group_id": 4,
      "coord_group_id": null,
      "attendance_pct": 98,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAUDHARY%20ARYANKUMAR%20G.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-37",
      "roll_no": "37",
      "enrollment_no": "25BECE30037",
      "full_name": "CHAUDHARY HARSH M.",
      "email": "chaudhary.harsh.m@ldrp.ac.in",
      "phone": "9879000037",
      "role": "STUDENT",
      "group_id": 4,
      "coord_group_id": null,
      "attendance_pct": 88,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAUDHARY%20HARSH%20M.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-38",
      "roll_no": "38",
      "enrollment_no": "25BECE30038",
      "full_name": "CHAUDHARY RIYABEN S.",
      "email": "chaudhary.riyaben.s@ldrp.ac.in",
      "phone": "9879000038",
      "role": "STUDENT",
      "group_id": 4,
      "coord_group_id": null,
      "attendance_pct": 88,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAUDHARY%20RIYABEN%20S.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-39",
      "roll_no": "39",
      "enrollment_no": "25BECE30039",
      "full_name": "CHAUHAN HIMESH J.",
      "email": "chauhan.himesh.j@ldrp.ac.in",
      "phone": "9879000039",
      "role": "STUDENT",
      "group_id": 4,
      "coord_group_id": null,
      "attendance_pct": 95,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAUHAN%20HIMESH%20J.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-40",
      "roll_no": "40",
      "enrollment_no": "25BECE30040",
      "full_name": "CHAUHAN JIMESHKUMAR R.",
      "email": "chauhan.jimeshkumar.r@ldrp.ac.in",
      "phone": "9879000040",
      "role": "STUDENT",
      "group_id": 4,
      "coord_group_id": null,
      "attendance_pct": 78,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAUHAN%20JIMESHKUMAR%20R.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-41",
      "roll_no": "41",
      "enrollment_no": "25BECE30041",
      "full_name": "CHAUHAN PRADIPSINH B.",
      "email": "chauhan.pradipsinh.b@ldrp.ac.in",
      "phone": "9879000041",
      "role": "STUDENT",
      "group_id": 5,
      "coord_group_id": null,
      "attendance_pct": 82,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAUHAN%20PRADIPSINH%20B.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-42",
      "roll_no": "42",
      "enrollment_no": "25BECE30042",
      "full_name": "CHAUHAN PRIYARAJSINH V.",
      "email": "chauhan.priyarajsinh.v@ldrp.ac.in",
      "phone": "9879000042",
      "role": "STUDENT",
      "group_id": 5,
      "coord_group_id": null,
      "attendance_pct": 88,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAUHAN%20PRIYARAJSINH%20V.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-43",
      "roll_no": "43",
      "enrollment_no": "25BECE30043",
      "full_name": "CHAUHAN SHIVAM P.",
      "email": "chauhan.shivam.p@ldrp.ac.in",
      "phone": "9879000043",
      "role": "STUDENT",
      "group_id": 5,
      "coord_group_id": null,
      "attendance_pct": 89,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAUHAN%20SHIVAM%20P.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-44",
      "roll_no": "44",
      "enrollment_no": "25BECE30044",
      "full_name": "HELI CHAVDA",
      "email": "heli.chavda@ldrp.ac.in",
      "phone": "9879000044",
      "role": "STUDENT",
      "group_id": 5,
      "coord_group_id": null,
      "attendance_pct": 91,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=HELI%20CHAVDA&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-45",
      "roll_no": "45",
      "enrollment_no": "25BECE30045",
      "full_name": "CHAVDA HETVI L.",
      "email": "chavda.hetvi.l@ldrp.ac.in",
      "phone": "9879000045",
      "role": "STUDENT",
      "group_id": 5,
      "coord_group_id": null,
      "attendance_pct": 98,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAVDA%20HETVI%20L.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-46",
      "roll_no": "46",
      "enrollment_no": "25BECE30046",
      "full_name": "CHAVDA KRISH R.",
      "email": "chavda.krish.r@ldrp.ac.in",
      "phone": "9879000046",
      "role": "STUDENT",
      "group_id": 5,
      "coord_group_id": null,
      "attendance_pct": 85,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAVDA%20KRISH%20R.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-47",
      "roll_no": "47",
      "enrollment_no": "25BECE30047",
      "full_name": "CHAVDA ZARNA R.",
      "email": "chavda.zarna.r@ldrp.ac.in",
      "phone": "9879000047",
      "role": "GROUP_COORD",
      "group_id": 5,
      "coord_group_id": 5,
      "attendance_pct": 90,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAVDA%20ZARNA%20R.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-48",
      "roll_no": "48",
      "enrollment_no": "25BECE30048",
      "full_name": "DABHI BHARDWAJBHAI D.",
      "email": "dabhi.bhardwajbhai.d@ldrp.ac.in",
      "phone": "9879000048",
      "role": "STUDENT",
      "group_id": 5,
      "coord_group_id": null,
      "attendance_pct": 94,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DABHI%20BHARDWAJBHAI%20D.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-49",
      "roll_no": "49",
      "enrollment_no": "25BECE30049",
      "full_name": "DABHI CHRIS MANISH",
      "email": "dabhi.chris.manish@ldrp.ac.in",
      "phone": "9879000049",
      "role": "STUDENT",
      "group_id": 5,
      "coord_group_id": null,
      "attendance_pct": 78,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DABHI%20CHRIS%20MANISH&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-50",
      "roll_no": "50",
      "enrollment_no": "25BECE30050",
      "full_name": "PURVA BHARAT DABHI",
      "email": "purva.bharat.dabhi@ldrp.ac.in",
      "phone": "9879000050",
      "role": "STUDENT",
      "group_id": 5,
      "coord_group_id": null,
      "attendance_pct": 94,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=PURVA%20BHARAT%20DABHI&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-51",
      "roll_no": "51",
      "enrollment_no": "25BECE30051",
      "full_name": "DADHANIYA RITU C.",
      "email": "dadhaniya.ritu.c@ldrp.ac.in",
      "phone": "9879000051",
      "role": "STUDENT",
      "group_id": 6,
      "coord_group_id": null,
      "attendance_pct": 88,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DADHANIYA%20RITU%20C.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-52",
      "roll_no": "52",
      "enrollment_no": "25BECE30052",
      "full_name": "DAHIMA MIHIR M.",
      "email": "dahima.mihir.m@ldrp.ac.in",
      "phone": "9879000052",
      "role": "STUDENT",
      "group_id": 6,
      "coord_group_id": null,
      "attendance_pct": 92,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DAHIMA%20MIHIR%20M.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-53",
      "roll_no": "53",
      "enrollment_no": "25BECE30053",
      "full_name": "DALVADI ASMITABEN J.",
      "email": "dalvadi.asmitaben.j@ldrp.ac.in",
      "phone": "9879000053",
      "role": "STUDENT",
      "group_id": 6,
      "coord_group_id": null,
      "attendance_pct": 90,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DALVADI%20ASMITABEN%20J.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-54",
      "roll_no": "54",
      "enrollment_no": "25BECE30054",
      "full_name": "DARJI DIKSHANTKUMAR B.",
      "email": "darji.dikshantkumar.b@ldrp.ac.in",
      "phone": "9879000054",
      "role": "STUDENT",
      "group_id": 6,
      "coord_group_id": null,
      "attendance_pct": 89,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DARJI%20DIKSHANTKUMAR%20B.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-55",
      "roll_no": "55",
      "enrollment_no": "25BECE30055",
      "full_name": "DARJI KRIPAL K.",
      "email": "darji.kripal.k@ldrp.ac.in",
      "phone": "9879000055",
      "role": "STUDENT",
      "group_id": 6,
      "coord_group_id": null,
      "attendance_pct": 82,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DARJI%20KRIPAL%20K.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-56",
      "roll_no": "56",
      "enrollment_no": "25BECE30056",
      "full_name": "DARJI VINITKUMAR R.",
      "email": "darji.vinitkumar.r@ldrp.ac.in",
      "phone": "9879000056",
      "role": "STUDENT",
      "group_id": 6,
      "coord_group_id": null,
      "attendance_pct": 91,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DARJI%20VINITKUMAR%20R.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-57",
      "roll_no": "57",
      "enrollment_no": "25BECE30057",
      "full_name": "DASADIYA BHAVYA G.",
      "email": "dasadiya.bhavya.g@ldrp.ac.in",
      "phone": "9879000057",
      "role": "STUDENT",
      "group_id": 6,
      "coord_group_id": null,
      "attendance_pct": 89,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DASADIYA%20BHAVYA%20G.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-58",
      "roll_no": "58",
      "enrollment_no": "25BECE30058",
      "full_name": "DAVE RUDRA K.",
      "email": "dave.rudra.k@ldrp.ac.in",
      "phone": "9879000058",
      "role": "STUDENT",
      "group_id": 6,
      "coord_group_id": null,
      "attendance_pct": 94,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DAVE%20RUDRA%20K.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-59",
      "roll_no": "59",
      "enrollment_no": "25BECE30059",
      "full_name": "DAVE SALONI H.",
      "email": "dave.saloni.h@ldrp.ac.in",
      "phone": "9879000059",
      "role": "STUDENT",
      "group_id": 6,
      "coord_group_id": null,
      "attendance_pct": 88,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DAVE%20SALONI%20H.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-60",
      "roll_no": "60",
      "enrollment_no": "25BECE30060",
      "full_name": "DAVE SAUMYA P.",
      "email": "dave.saumya.p@ldrp.ac.in",
      "phone": "9879000060",
      "role": "STUDENT",
      "group_id": 6,
      "coord_group_id": null,
      "attendance_pct": 92,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DAVE%20SAUMYA%20P.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-61",
      "roll_no": "61",
      "enrollment_no": "25BECE30061",
      "full_name": "DESAI CHEHAR N.",
      "email": "desai.chehar.n@ldrp.ac.in",
      "phone": "9879000061",
      "role": "STUDENT",
      "group_id": 7,
      "coord_group_id": null,
      "attendance_pct": 84,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DESAI%20CHEHAR%20N.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-62",
      "roll_no": "62",
      "enrollment_no": "25BECE30062",
      "full_name": "DESAI PRIT M.",
      "email": "desai.prit.m@ldrp.ac.in",
      "phone": "9879000062",
      "role": "STUDENT",
      "group_id": 7,
      "coord_group_id": null,
      "attendance_pct": 81,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DESAI%20PRIT%20M.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-63",
      "roll_no": "63",
      "enrollment_no": "25BECE30063",
      "full_name": "DETROJA PARTH J.",
      "email": "detroja.parth.j@ldrp.ac.in",
      "phone": "9879000063",
      "role": "STUDENT",
      "group_id": 7,
      "coord_group_id": null,
      "attendance_pct": 87,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DETROJA%20PARTH%20J.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-64",
      "roll_no": "64",
      "enrollment_no": "25BECE30064",
      "full_name": "DHOLARIYA GREENABEN H.",
      "email": "dholariya.greenaben.h@ldrp.ac.in",
      "phone": "9879000064",
      "role": "STUDENT",
      "group_id": 7,
      "coord_group_id": null,
      "attendance_pct": 84,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DHOLARIYA%20GREENABEN%20H.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-65",
      "roll_no": "65",
      "enrollment_no": "25BECE30065",
      "full_name": "PRAJAPATI DISHANT D.",
      "email": "prajapati.dishant.d@ldrp.ac.in",
      "phone": "9879000065",
      "role": "STUDENT",
      "group_id": 7,
      "coord_group_id": null,
      "attendance_pct": 95,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=PRAJAPATI%20DISHANT%20D.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-66",
      "roll_no": "66",
      "enrollment_no": "25BECE30066",
      "full_name": "DOBARIYA KRISHABEN R.",
      "email": "dobariya.krishaben.r@ldrp.ac.in",
      "phone": "9879000066",
      "role": "STUDENT",
      "group_id": 7,
      "coord_group_id": null,
      "attendance_pct": 83,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DOBARIYA%20KRISHABEN%20R.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-67",
      "roll_no": "67",
      "enrollment_no": "25BECE30067",
      "full_name": "DOBARIYA MANTHAN R.",
      "email": "dobariya.manthan.r@ldrp.ac.in",
      "phone": "9879000067",
      "role": "STUDENT",
      "group_id": 7,
      "coord_group_id": null,
      "attendance_pct": 95,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DOBARIYA%20MANTHAN%20R.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-68",
      "roll_no": "68",
      "enrollment_no": "25BECE30068",
      "full_name": "DODIYA SUMITKUMAR J.",
      "email": "dodiya.sumitkumar.j@ldrp.ac.in",
      "phone": "9879000068",
      "role": "STUDENT",
      "group_id": 7,
      "coord_group_id": null,
      "attendance_pct": 89,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DODIYA%20SUMITKUMAR%20J.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-69",
      "roll_no": "69",
      "enrollment_no": "25BECE30069",
      "full_name": "DOSHI HETVI U.",
      "email": "doshi.hetvi.u@ldrp.ac.in",
      "phone": "9879000069",
      "role": "STUDENT",
      "group_id": 7,
      "coord_group_id": null,
      "attendance_pct": 81,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=DOSHI%20HETVI%20U.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-70",
      "roll_no": "70",
      "enrollment_no": "25BECE30070",
      "full_name": "PRAJAPATI SAKSHI V.",
      "email": "prajapati.sakshi.v@ldrp.ac.in",
      "phone": "9879000070",
      "role": "STUDENT",
      "group_id": 7,
      "coord_group_id": null,
      "attendance_pct": 96,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=PRAJAPATI%20SAKSHI%20V.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-71",
      "roll_no": "D2D-CE-01",
      "enrollment_no": "25BED2D3001",
      "full_name": "HADIYAL DARSHIL K.",
      "email": "hadiyal.darshil.k@ldrp.ac.in",
      "phone": "9879000071",
      "role": "STUDENT",
      "group_id": 8,
      "coord_group_id": null,
      "attendance_pct": 81,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=HADIYAL%20DARSHIL%20K.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-72",
      "roll_no": "D2D-CE-02",
      "enrollment_no": "25BED2D3002",
      "full_name": "CHAVDA VISHESH H.",
      "email": "chavda.vishesh.h@ldrp.ac.in",
      "phone": "9879000072",
      "role": "STUDENT",
      "group_id": 8,
      "coord_group_id": null,
      "attendance_pct": 87,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=CHAVDA%20VISHESH%20H.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-73",
      "roll_no": "D2D-CE-03",
      "enrollment_no": "25BED2D3003",
      "full_name": "RUPAREL NEMIS K.",
      "email": "ruparel.nemis.k@ldrp.ac.in",
      "phone": "9879000073",
      "role": "GROUP_COORD",
      "group_id": 8,
      "coord_group_id": 8,
      "attendance_pct": 79,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=RUPAREL%20NEMIS%20K.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-74",
      "roll_no": "D2D-CE-04",
      "enrollment_no": "25BED2D3004",
      "full_name": "VORA YASHASVI D.",
      "email": "vora.yashasvi.d@ldrp.ac.in",
      "phone": "9879000074",
      "role": "STUDENT",
      "group_id": 8,
      "coord_group_id": null,
      "attendance_pct": 97,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=VORA%20YASHASVI%20D.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-75",
      "roll_no": "D2D-CE-05",
      "enrollment_no": "25BED2D3005",
      "full_name": "VORA MAHAMMADKAIF I.",
      "email": "vora.mahammadkaif.i@ldrp.ac.in",
      "phone": "9879000075",
      "role": "STUDENT",
      "group_id": 8,
      "coord_group_id": null,
      "attendance_pct": 83,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=VORA%20MAHAMMADKAIF%20I.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-76",
      "roll_no": "D2D-CE-06",
      "enrollment_no": "25BED2D3006",
      "full_name": "SONI RUDRA R.",
      "email": "soni.rudra.r@ldrp.ac.in",
      "phone": "9879000076",
      "role": "STUDENT",
      "group_id": 8,
      "coord_group_id": null,
      "attendance_pct": 86,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=SONI%20RUDRA%20R.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-77",
      "roll_no": "D2D-CE-07",
      "enrollment_no": "25BED2D3007",
      "full_name": "BAROT ADITYA S.",
      "email": "barot.aditya.s@ldrp.ac.in",
      "phone": "9879000077",
      "role": "STUDENT",
      "group_id": 8,
      "coord_group_id": null,
      "attendance_pct": 82,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=BAROT%20ADITYA%20S.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-78",
      "roll_no": "D2D-CE-08",
      "enrollment_no": "25BED2D3008",
      "full_name": "SAGAR YUG K.",
      "email": "sagar.yug.k@ldrp.ac.in",
      "phone": "9879000078",
      "role": "STUDENT",
      "group_id": 8,
      "coord_group_id": null,
      "attendance_pct": 94,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=SAGAR%20YUG%20K.&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    },
    {
      "id": "student-79",
      "roll_no": "326",
      "enrollment_no": "25BECE30326",
      "full_name": "PRAJAPATI SAKSHI V. (Lateral)",
      "email": "prajapati.sakshi.v.lateral@ldrp.ac.in",
      "phone": "9879000079",
      "role": "STUDENT",
      "group_id": 8,
      "coord_group_id": null,
      "attendance_pct": 79,
      "semester": 3,
      "branch": "Computer Engineering (CE-A)",
      "college": "LDRP Institute of Technology and Research",
      "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=PRAJAPATI%20SAKSHI%20V.%20(Lateral)&backgroundColor=0284c7,1e3a8a,f59e0b,10b981",
      "password": "$2a$10$Bd.rHSSoL1F.3X/divZe3u7sU1BbxQDjvjnMARRQ9cQjFWOVfUYn6"
    }
  ],
  "groups": [
    {
      "id": 1,
      "group_number": 1,
      "name": "Group 1 (Roll 1 - 10)",
      "roll_range": "1 - 10",
      "coordinator_name": "Vyom Bhatt",
      "coordinator_roll": "25",
      "color": "#10b981",
      "badge": "G1",
      "total_students": 10
    },
    {
      "id": 2,
      "group_number": 2,
      "name": "Group 2 (Roll 11 - 20)",
      "roll_range": "11 - 20",
      "coordinator_name": "Kavya Barot",
      "coordinator_roll": "15",
      "color": "#f59e0b",
      "badge": "G2",
      "total_students": 10
    },
    {
      "id": 3,
      "group_number": 3,
      "name": "Group 3 (Roll 21 - 30)",
      "roll_range": "21 - 30",
      "coordinator_name": "Pushti Bhalani",
      "coordinator_roll": "18",
      "color": "#3b82f6",
      "badge": "G3",
      "total_students": 10
    },
    {
      "id": 4,
      "group_number": 4,
      "name": "Group 4 (Roll 31 - 40)",
      "roll_range": "31 - 40",
      "coordinator_name": "Kishan Bhoraniya",
      "coordinator_roll": "26",
      "color": "#06b6d4",
      "badge": "G4",
      "total_students": 10
    },
    {
      "id": 5,
      "group_number": 5,
      "name": "Group 5 (Roll 41 - 50)",
      "roll_range": "41 - 50",
      "coordinator_name": "Zarna Chavda",
      "coordinator_roll": "47",
      "color": "#ec4899",
      "badge": "G5",
      "total_students": 10
    },
    {
      "id": 6,
      "group_number": 6,
      "name": "Group 6 (Roll 51 - 60)",
      "roll_range": "51 - 60",
      "coordinator_name": "Ananya Buddham",
      "coordinator_roll": "30",
      "color": "#8b5cf6",
      "badge": "G6",
      "total_students": 10
    },
    {
      "id": 7,
      "group_number": 7,
      "name": "Group 7 (Roll 61 - 70)",
      "roll_range": "61 - 70",
      "coordinator_name": "Neel Brahmbhatt",
      "coordinator_roll": "29",
      "color": "#6366f1",
      "badge": "G7",
      "total_students": 10
    },
    {
      "id": 8,
      "group_number": 8,
      "name": "Group 8 (D2D-CE-01 to 08 & 326)",
      "roll_range": "D2D & 326",
      "coordinator_name": "Nemish Ruparel",
      "coordinator_roll": "D2D-CE-03",
      "color": "#a855f7",
      "badge": "G8",
      "total_students": 9
    }
  ],
  "forms": [
    {
      "id": "form-101",
      "title": "Holiday Declaration: Attendance for 26th August",
      "description": "Please declare your attendance status for Monday, 26th August. Mentors require exact headcount to plan laboratory practical sessions.",
      "form_type": "HOLIDAY_DECLARATION",
      "deadline": "2026-08-23T04:09:36.834Z",
      "created_by": "mentor-2",
      "created_by_name": "Dr. Hitsh Barot",
      "is_active": true,
      "requires_file": false,
      "questions": [
        {
          "id": "q1",
          "label": "Attendance Intention for 26th Aug",
          "type": "select",
          "options": [
            "I will attend college (Present)",
            "I will be absent",
            "Commuting from native/hostel (Late arrival)"
          ],
          "required": true
        },
        {
          "id": "q2",
          "label": "Reason if Absent / Late",
          "type": "text",
          "required": false
        }
      ]
    },
    {
      "id": "form-102",
      "title": "GTU Mid-Semester Exam Undertaking & Verification Form",
      "description": "All CE-A students must verify their registered exam subjects and submit their signed undertaking form.",
      "form_type": "DOCUMENT_UPLOAD",
      "deadline": "2026-08-25T04:09:36.836Z",
      "created_by": "student-20",
      "created_by_name": "Priyanshu Bharadava (CR)",
      "is_active": true,
      "requires_file": true,
      "questions": [
        {
          "id": "q1",
          "label": "Have you cleared all term fee dues?",
          "type": "radio",
          "options": [
            "Yes, Paid",
            "Pending Receipt"
          ],
          "required": true
        },
        {
          "id": "q2",
          "label": "Upload Fee Receipt / Undertaking PDF",
          "type": "file",
          "required": true
        }
      ]
    },
    {
      "id": "form-103",
      "title": "Industrial Visit & Tech Expo Consent Form",
      "description": "Consent from parents for the upcoming 1-day Industrial Visit to GIFT City & TCS Gandhinagar.",
      "form_type": "GENERAL_SURVEY",
      "deadline": "2026-08-29T04:09:36.836Z",
      "created_by": "mentor-1",
      "created_by_name": "Prof. Avani Patel",
      "is_active": true,
      "requires_file": false,
      "questions": [
        {
          "id": "q1",
          "label": "Are you participating in the Industrial Visit?",
          "type": "radio",
          "options": [
            "Yes, Confirmed",
            "No"
          ],
          "required": true
        },
        {
          "id": "q2",
          "label": "Emergency Parent Contact Number",
          "type": "text",
          "required": true
        }
      ]
    }
  ],
  "submissions": [
    {
      "id": "sub-1",
      "form_id": "form-101",
      "student_id": "student-20",
      "student_name": "PRIYANSHU BHARADAVA",
      "roll_no": "20",
      "enrollment_no": "25BECE30020",
      "group_id": 2,
      "response_data": {
        "q1": "I will attend college (Present)",
        "q2": "Conducting CR duties & attending all practicals"
      },
      "attachment_url": null,
      "status": "APPROVED",
      "submitted_at": "2026-08-22T02:09:36.836Z"
    },
    {
      "id": "sub-2",
      "form_id": "form-101",
      "student_id": "student-1",
      "student_name": "AAL ANAND L.",
      "roll_no": "1",
      "enrollment_no": "25BECE30001",
      "group_id": 1,
      "response_data": {
        "q1": "I will attend college (Present)",
        "q2": ""
      },
      "status": "VERIFIED",
      "submitted_at": "2026-08-22T10:52:12.983Z"
    },
    {
      "id": "sub-3",
      "form_id": "form-101",
      "student_id": "student-15",
      "student_name": "BAROT KAVYA S.",
      "roll_no": "15",
      "enrollment_no": "25BECE30015",
      "group_id": 2,
      "response_data": {
        "q1": "I will attend college (Present)",
        "q2": ""
      },
      "attachment_url": null,
      "status": "APPROVED",
      "submitted_at": "2026-08-22T00:09:36.836Z"
    },
    {
      "id": "sub-4",
      "form_id": "form-101",
      "student_id": "student-25",
      "student_name": "BHATT VYOM R.",
      "roll_no": "25",
      "enrollment_no": "25BECE30025",
      "group_id": 3,
      "response_data": {
        "q1": "I will attend college (Present)",
        "q2": ""
      },
      "attachment_url": null,
      "status": "APPROVED",
      "submitted_at": "2026-08-21T23:09:36.836Z"
    },
    {
      "id": "sub-5",
      "form_id": "form-101",
      "student_id": "student-73",
      "student_name": "RUPAREL NEMIS K.",
      "roll_no": "D2D-CE-03",
      "enrollment_no": "25BED2D3003",
      "group_id": 8,
      "response_data": {
        "q1": "I will attend college (Present)",
        "q2": "Attending D2D Bridge Practical"
      },
      "attachment_url": null,
      "status": "VERIFIED",
      "submitted_at": "2026-08-22T03:09:36.836Z"
    }
  ],
  "announcements": [
    {
      "id": "ann-1",
      "title": "🚨 URGENT: DSA Practical Session Shifted to Lab 5",
      "content": "Due to server maintenance in Lab 3, today's Data Structures & Algorithms practical for all CE-A batches will be conducted in Lab 5 (Ground Floor). Please report directly with your lab journals.",
      "priority": "URGENT",
      "posted_by_name": "Dr. Hitsh Barot",
      "posted_by_role": "Mentor",
      "target_group": null,
      "created_at": "2026-08-22T03:24:36.836Z"
    },
    {
      "id": "ann-2",
      "title": "📋 Mid-Semester Examination Timetable Published",
      "content": "The mid-sem exam dates for Semester 3 have been finalized starting from 15th September. Syllabus covers Units 1, 2, and 3 for all five core subjects. Detailed schedule available in the Calendar section.",
      "priority": "IMPORTANT",
      "posted_by_name": "Prof. Avani Patel",
      "posted_by_role": "Mentor",
      "target_group": null,
      "created_at": "2026-08-21T16:09:36.836Z"
    },
    {
      "id": "ann-3",
      "title": "📢 D2D Bridge Course - Mathematics-3 Tutorial Slot",
      "content": "Special tutorial class for D2D students (Group 8) is scheduled on Friday at 3:30 PM in Room 204. Attendance is compulsory.",
      "priority": "IMPORTANT",
      "posted_by_name": "Priyanshu Bharadava (CR)",
      "posted_by_role": "Class Coordinator",
      "target_group": 8,
      "created_at": "2026-08-21T04:09:36.836Z"
    }
  ],
  "leaves": [
    {
      "id": "leave-1",
      "student_id": "student-13",
      "student_name": "BARAD PRABHAT M.",
      "roll_no": "13",
      "group_id": 2,
      "from_date": "2026-08-25",
      "to_date": "2026-08-26",
      "reason": "Severe viral fever, doctor advised 2 days rest.",
      "medical_proof_url": null,
      "coordinator_status": "VERIFIED",
      "mentor_status": "APPROVED",
      "applied_at": "2026-08-21T04:09:36.836Z"
    },
    {
      "id": "leave-2",
      "student_id": "student-37",
      "student_name": "CHAUDHARY HARSH M.",
      "roll_no": "37",
      "group_id": 4,
      "from_date": "2026-08-27",
      "to_date": "2026-08-28",
      "reason": "Representing LDRP in Inter-College Volleyball Tournament at GTU.",
      "medical_proof_url": null,
      "coordinator_status": "VERIFIED",
      "mentor_status": "PENDING",
      "applied_at": "2026-08-21T22:09:36.836Z"
    }
  ],
  "subjects": [
    {
      "id": "sub-dsa",
      "code": "3130702",
      "name": "Data Structures & Algorithms (DSA)",
      "faculty": "Dr. Hitsh Barot",
      "credits": 5,
      "attendance_pct": 92,
      "materials": [
        {
          "id": "m1",
          "title": "Unit 1: Linear Data Structures & Stacks Notes (PDF)",
          "type": "Notes",
          "size": "3.2 MB",
          "url": "#"
        },
        {
          "id": "m2",
          "title": "GTU Previous 5-Year Question Papers with Solutions",
          "type": "PYQ",
          "size": "8.5 MB",
          "url": "#"
        },
        {
          "id": "m3",
          "title": "Lab Practical List 1 to 14 (C/C++ Code Solutions)",
          "type": "Code",
          "size": "1.8 MB",
          "url": "#"
        }
      ]
    },
    {
      "id": "sub-dbms",
      "code": "3130703",
      "name": "Database Management Systems (DBMS)",
      "faculty": "Prof. Avani Patel",
      "credits": 5,
      "attendance_pct": 88,
      "materials": [
        {
          "id": "m4",
          "title": "Unit 2: ER-Diagrams, Relational Algebra & Normalization",
          "type": "Notes",
          "size": "4.1 MB",
          "url": "#"
        },
        {
          "id": "m5",
          "title": "SQL Lab Queries & PL/SQL Trigger Cheatsheet",
          "type": "Code",
          "size": "2.1 MB",
          "url": "#"
        },
        {
          "id": "m6",
          "title": "GTU DBMS Mid-Sem & Final Exam PYQs Bank",
          "type": "PYQ",
          "size": "6.4 MB",
          "url": "#"
        }
      ]
    },
    {
      "id": "sub-java",
      "code": "3130704",
      "name": "Object Oriented Programming using Java",
      "faculty": "Prof. R. M. Sharma",
      "credits": 4,
      "attendance_pct": 95,
      "materials": [
        {
          "id": "m7",
          "title": "OOPs Concepts, Multithreading & Exception Handling",
          "type": "Notes",
          "size": "5.0 MB",
          "url": "#"
        },
        {
          "id": "m8",
          "title": "Java Collections Framework & GUI Swing Programs",
          "type": "Code",
          "size": "3.4 MB",
          "url": "#"
        }
      ]
    },
    {
      "id": "sub-maths",
      "code": "3130006",
      "name": "Probability & Statistics / Discrete Mathematics",
      "faculty": "Dr. S. K. Joshi",
      "credits": 4,
      "attendance_pct": 81,
      "materials": [
        {
          "id": "m9",
          "title": "Formulas Handbook: Graph Theory & Combinatorics",
          "type": "Notes",
          "size": "2.8 MB",
          "url": "#"
        },
        {
          "id": "m10",
          "title": "Solved Examples & Previous Year Mid-Sem Tests",
          "type": "PYQ",
          "size": "7.1 MB",
          "url": "#"
        }
      ]
    }
  ],
  "timetable": [
    {
      "day": "Monday",
      "slots": [
        {
          "time": "09:30 AM - 10:30 AM",
          "subject": "Discrete Mathematics",
          "room": "Room 304",
          "faculty": "Dr. S. K. Joshi",
          "type": "Lecture"
        },
        {
          "time": "10:30 AM - 12:30 PM",
          "subject": "DSA Lab (Batch A1 & A2)",
          "room": "Lab 5",
          "faculty": "Dr. Hitsh Barot",
          "type": "Practical"
        },
        {
          "time": "01:15 PM - 02:15 PM",
          "subject": "DBMS",
          "room": "Room 304",
          "faculty": "Prof. Avani Patel",
          "type": "Lecture"
        },
        {
          "time": "02:15 PM - 03:15 PM",
          "subject": "OOP using Java",
          "room": "Room 304",
          "faculty": "Prof. R. M. Sharma",
          "type": "Lecture"
        }
      ]
    },
    {
      "day": "Tuesday",
      "slots": [
        {
          "time": "09:30 AM - 10:30 AM",
          "subject": "DBMS",
          "room": "Room 304",
          "faculty": "Prof. Avani Patel",
          "type": "Lecture"
        },
        {
          "time": "10:30 AM - 12:30 PM",
          "subject": "DBMS Lab (Batch A1 & A2)",
          "room": "Lab 3",
          "faculty": "Prof. Avani Patel",
          "type": "Practical"
        },
        {
          "time": "01:15 PM - 02:15 PM",
          "subject": "DSA Lecture",
          "room": "Room 304",
          "faculty": "Dr. Hitsh Barot",
          "type": "Lecture"
        },
        {
          "time": "02:15 PM - 03:15 PM",
          "subject": "Digital Electronics",
          "room": "Room 304",
          "faculty": "Prof. D. K. Shah",
          "type": "Lecture"
        }
      ]
    },
    {
      "day": "Wednesday",
      "slots": [
        {
          "time": "09:30 AM - 10:30 AM",
          "subject": "OOP using Java",
          "room": "Room 304",
          "faculty": "Prof. R. M. Sharma",
          "type": "Lecture"
        },
        {
          "time": "10:30 AM - 12:30 PM",
          "subject": "Java Programming Lab",
          "room": "Lab 2",
          "faculty": "Prof. R. M. Sharma",
          "type": "Practical"
        },
        {
          "time": "01:15 PM - 02:15 PM",
          "subject": "Discrete Mathematics",
          "room": "Room 304",
          "faculty": "Dr. S. K. Joshi",
          "type": "Lecture"
        },
        {
          "time": "02:15 PM - 03:15 PM",
          "subject": "DSA Lecture",
          "room": "Room 304",
          "faculty": "Dr. Hitsh Barot",
          "type": "Lecture"
        }
      ]
    },
    {
      "day": "Thursday",
      "slots": [
        {
          "time": "09:30 AM - 10:30 AM",
          "subject": "DSA Lecture",
          "room": "Room 304",
          "faculty": "Dr. Hitsh Barot",
          "type": "Lecture"
        },
        {
          "time": "10:30 AM - 11:30 AM",
          "subject": "DBMS Lecture",
          "room": "Room 304",
          "faculty": "Prof. Avani Patel",
          "type": "Lecture"
        },
        {
          "time": "11:30 AM - 12:30 PM",
          "subject": "Digital Electronics",
          "room": "Room 304",
          "faculty": "Prof. D. K. Shah",
          "type": "Lecture"
        },
        {
          "time": "01:15 PM - 03:15 PM",
          "subject": "Mentoring & CR Review Session",
          "room": "Seminar Hall 1",
          "faculty": "Prof. Avani & Dr. Hitsh",
          "type": "Activity"
        }
      ]
    },
    {
      "day": "Friday",
      "slots": [
        {
          "time": "09:30 AM - 10:30 AM",
          "subject": "OOP using Java",
          "room": "Room 304",
          "faculty": "Prof. R. M. Sharma",
          "type": "Lecture"
        },
        {
          "time": "10:30 AM - 12:30 PM",
          "subject": "Web Development / Mini Project Lab",
          "room": "Lab 7",
          "faculty": "Prof. Avani Patel",
          "type": "Practical"
        },
        {
          "time": "01:15 PM - 02:15 PM",
          "subject": "Discrete Mathematics",
          "room": "Room 304",
          "faculty": "Dr. S. K. Joshi",
          "type": "Lecture"
        },
        {
          "time": "02:15 PM - 03:15 PM",
          "subject": "D2D Bridge Math Slot (Group 8)",
          "room": "Room 204",
          "faculty": "Dr. S. K. Joshi",
          "type": "Tutorial"
        }
      ]
    }
  ],
  "last_updated": "2026-08-22T10:52:12.983Z"
};

app.use(helmet({ crossOriginResourcePolicy: false, contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Access token required.' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token.' });
    const user = db.users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  });
}

app.get(['/api/health', '/health'], (req, res) => res.json({ status: 'healthy', version: '1.0.0', serverless: true }));

app.get(['/api/auth/demo-accounts', '/auth/demo-accounts'], (req, res) => {
  const demoProfiles = [
    { label: 'Class Coordinator (CR)', name: 'Priyanshu Bharadava', role: 'CLASS_COORD', roll_no: '20', enrollment_no: '25BECE30020' },
    { label: 'Class Mentor (Faculty)', name: 'Dr. Hitsh Barot', role: 'MENTOR', roll_no: 'FAC-02', enrollment_no: 'LDRP-FAC-002' },
    { label: 'Class Mentor (Faculty)', name: 'Prof. Avani Patel', role: 'MENTOR', roll_no: 'FAC-01', enrollment_no: 'LDRP-FAC-001' },
    { label: 'Group 2 Coordinator', name: 'Kavya Barot', role: 'GROUP_COORD', roll_no: '15', enrollment_no: '25BECE30015' },
    { label: 'Group 1 Coordinator', name: 'Vyom Bhatt', role: 'GROUP_COORD', roll_no: '25', enrollment_no: '25BECE30025' },
    { label: 'Group 8 (D2D) Coordinator', name: 'Nemish Ruparel', role: 'GROUP_COORD', roll_no: 'D2D-CE-03', enrollment_no: '25BED2D3003' },
    { label: 'Regular Student', name: 'Aal Anand L.', role: 'STUDENT', roll_no: '1', enrollment_no: '25BECE30001' }
  ];
  res.json({ success: true, demoProfiles, defaultPassword: 'ldrp123' });
});

app.post(['/api/auth/login', '/auth/login'], (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Please provide ID and password.' });
  }

  const cleanId = identifier.trim().toLowerCase();
  const user = db.users.find(u =>
    u.roll_no.toLowerCase() === cleanId ||
    u.enrollment_no.toLowerCase() === cleanId ||
    u.email.toLowerCase() === cleanId
  );

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. User not found in CE-A registry.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Incorrect password. (Default is ldrp123)' });
  }

  const token = jwt.sign({ id: user.id, role: user.role, roll_no: user.roll_no }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safeUser } = user;
  const groupInfo = user.group_id ? db.groups.find(g => g.id === user.group_id) : null;
  const coordGroupInfo = user.coord_group_id ? db.groups.find(g => g.id === user.coord_group_id) : null;

  return res.json({
    success: true,
    message: 'Welcome back, ' + user.full_name + '!',
    token,
    user: Object.assign({}, safeUser, { group: groupInfo, coord_group: coordGroupInfo })
  });
});

app.get(['/api/auth/me', '/auth/me'], authenticateToken, (req, res) => {
  const groupInfo = req.user.group_id ? db.groups.find(g => g.id === req.user.group_id) : null;
  const coordGroupInfo = req.user.coord_group_id ? db.groups.find(g => g.id === req.user.coord_group_id) : null;
  res.json({ success: true, user: Object.assign({}, req.user, { group: groupInfo, coord_group: coordGroupInfo }) });
});

app.get(['/api/students', '/students'], authenticateToken, (req, res) => {
  const { group, search, role } = req.query;
  let students = db.users.filter(u => u.role !== 'MENTOR').map(u => {
    const { password, ...safe } = u;
    const groupInfo = db.groups.find(g => g.id === u.group_id);
    return Object.assign({}, safe, { group_name: groupInfo ? groupInfo.name : 'Unassigned', group_number: groupInfo ? groupInfo.group_number : null });
  });

  if (group) students = students.filter(s => s.group_id === parseInt(group));
  if (role) students = students.filter(s => s.role === role);
  if (search) {
    const q = search.toLowerCase().trim();
    students = students.filter(s => s.full_name.toLowerCase().includes(q) || s.roll_no.toLowerCase().includes(q) || s.enrollment_no.toLowerCase().includes(q));
  }
  res.json({ success: true, total: students.length, students });
});

app.get(['/api/students/groups', '/students/groups'], authenticateToken, (req, res) => {
  const groups = db.groups.map(g => {
    const members = db.users.filter(u => u.group_id === g.id && u.role !== 'MENTOR');
    return Object.assign({}, g, {
      member_count: members.length,
      average_attendance: 89,
      members: members.map(m => ({ id: m.id, roll_no: m.roll_no, enrollment_no: m.enrollment_no, full_name: m.full_name, phone: m.phone, attendance_pct: m.attendance_pct }))
    });
  });
  res.json({ success: true, groups });
});

app.get(['/api/forms', '/forms'], authenticateToken, (req, res) => {
  const forms = db.forms.map(form => {
    const totalSubmissions = db.submissions.filter(s => s.form_id === form.id);
    const userSubmission = totalSubmissions.find(s => s.student_id === req.user.id);
    const totalTarget = db.users.filter(u => u.role !== 'MENTOR').length;
    return Object.assign({}, form, {
      total_submissions: totalSubmissions.length,
      total_target: totalTarget,
      completion_rate: Math.round((totalSubmissions.length / totalTarget) * 100) || 0,
      user_submission: userSubmission || null,
      is_submitted_by_user: Boolean(userSubmission)
    });
  });
  res.json({ success: true, forms });
});

app.get(['/api/forms/:id', '/forms/:id'], authenticateToken, (req, res) => {
  const form = db.forms.find(f => f.id === req.params.id);
  if (!form) return res.status(404).json({ success: false, message: 'Form not found.' });

  const submissions = db.submissions.filter(s => s.form_id === form.id);
  const totalStudents = db.users.filter(u => u.role !== 'MENTOR');
  const groupStats = db.groups.map(g => {
    const groupStudents = db.users.filter(u => u.group_id === g.id && u.role !== 'MENTOR');
    const groupSubs = submissions.filter(s => s.group_id === g.id);
    return {
      group_id: g.id,
      group_name: g.name,
      coordinator_name: g.coordinator_name,
      total_students: groupStudents.length,
      submitted_count: groupSubs.length,
      pending_count: groupStudents.length - groupSubs.length,
      completion_pct: groupStudents.length > 0 ? Math.round((groupSubs.length / groupStudents.length) * 100) : 0,
      is_complete: groupSubs.length === groupStudents.length
    };
  });

  res.json({
    success: true,
    form,
    stats: { total_students: totalStudents.length, submitted_count: submissions.length, pending_count: totalStudents.length - submissions.length, completion_rate: Math.round((submissions.length / totalStudents.length) * 100) },
    groupStats,
    user_submission: submissions.find(s => s.student_id === req.user.id) || null,
    submissions: req.user.role === 'STUDENT' ? undefined : submissions
  });
});

app.post(['/api/forms/:id/submit', '/forms/:id/submit'], authenticateToken, (req, res) => {
  const form = db.forms.find(f => f.id === req.params.id);
  if (!form) return res.status(404).json({ success: false, message: 'Form not found.' });

  let responseData = req.body.response_data || req.body;
  if (typeof responseData === 'string') {
    try { responseData = JSON.parse(responseData); } catch (e) {}
  }

  const existingIdx = db.submissions.findIndex(s => s.form_id === form.id && s.student_id === req.user.id);
  const record = {
    id: existingIdx >= 0 ? db.submissions[existingIdx].id : 'sub-' + Date.now(),
    form_id: form.id,
    student_id: req.user.id,
    student_name: req.user.full_name,
    roll_no: req.user.roll_no,
    enrollment_no: req.user.enrollment_no,
    group_id: req.user.group_id,
    response_data: responseData,
    status: 'VERIFIED',
    submitted_at: new Date().toISOString()
  };

  if (existingIdx >= 0) db.submissions[existingIdx] = record;
  else db.submissions.push(record);

  res.json({ success: true, message: 'Submission recorded successfully!', submission: record });
});

app.get(['/api/forms/:id/nudge-list', '/forms/:id/nudge-list'], authenticateToken, (req, res) => {
  const form = db.forms.find(f => f.id === req.params.id);
  if (!form) return res.status(404).json({ success: false, message: 'Form not found.' });

  const submissions = db.submissions.filter(s => s.form_id === form.id);
  const submittedIds = new Set(submissions.map(s => s.student_id));
  const targetStudents = db.users.filter(u => u.role !== 'MENTOR' && !submittedIds.has(u.id));

  const nudgeList = targetStudents.map(student => {
    const groupInfo = db.groups.find(g => g.id === student.group_id);
    const msg = 'Hello ' + student.full_name + ' (Roll No. ' + student.roll_no + '), your submission for "' + form.title + '" is PENDING on CE-A Portal.';
    return {
      student_id: student.id,
      roll_no: student.roll_no,
      enrollment_no: student.enrollment_no,
      full_name: student.full_name,
      phone: student.phone,
      group_name: groupInfo ? groupInfo.name : 'Group',
      coordinator_name: groupInfo ? groupInfo.coordinator_name : 'Coordinator',
      whatsapp_link: 'https://wa.me/91' + (student.phone || '9879000000') + '?text=' + encodeURIComponent(msg),
      raw_message: msg
    };
  });

  res.json({ success: true, form_title: form.title, total_pending: nudgeList.length, nudge_list: nudgeList });
});

app.get(['/api/holidays/active-poll', '/holidays/active-poll'], authenticateToken, (req, res) => {
  const holidayForm = db.forms.find(f => f.form_type === 'HOLIDAY_DECLARATION' && f.is_active);
  if (!holidayForm) return res.json({ success: true, poll: null });

  const submissions = db.submissions.filter(s => s.form_id === holidayForm.id);
  const totalStudents = db.users.filter(u => u.role !== 'MENTOR');
  const userSub = submissions.find(s => s.student_id === req.user.id);

  let attending = 0, absent = 0, commuting = 0;
  submissions.forEach(s => {
    const val = (s.response_data && s.response_data.q1) || '';
    if (val.includes('Present') || val.includes('attend')) attending++;
    else if (val.includes('absent') || val.includes('Absent')) absent++;
    else commuting++;
  });

  const groupBreakdown = db.groups.map(g => {
    const members = db.users.filter(u => u.group_id === g.id && u.role !== 'MENTOR');
    const subs = submissions.filter(s => s.group_id === g.id);
    return { group_id: g.id, group_name: g.name, coordinator_name: g.coordinator_name, total: members.length, submitted: subs.length, is_complete: subs.length === members.length };
  });

  res.json({
    success: true,
    poll: Object.assign({}, holidayForm, {
      radar: {
        total_students: totalStudents.length,
        submitted: submissions.length,
        pending: totalStudents.length - submissions.length,
        attending, absent, commuting,
        attendance_rate: Math.round((attending / (submissions.length || 1)) * 100),
        completion_rate: Math.round((submissions.length / totalStudents.length) * 100)
      },
      group_breakdown: groupBreakdown,
      user_response: userSub ? userSub.response_data : null
    })
  });
});

app.post(['/api/holidays/vote', '/holidays/vote'], authenticateToken, (req, res) => {
  const { form_id, choice, reason } = req.body;
  const form = db.forms.find(f => f.id === form_id || (f.form_type === 'HOLIDAY_DECLARATION' && f.is_active));
  if (!form) return res.status(404).json({ success: false, message: 'Holiday form not found.' });

  const existingIdx = db.submissions.findIndex(s => s.form_id === form.id && s.student_id === req.user.id);
  const record = {
    id: existingIdx >= 0 ? db.submissions[existingIdx].id : 'sub-' + Date.now(),
    form_id: form.id,
    student_id: req.user.id,
    student_name: req.user.full_name,
    roll_no: req.user.roll_no,
    enrollment_no: req.user.enrollment_no,
    group_id: req.user.group_id,
    response_data: { q1: choice, q2: reason || '' },
    status: 'VERIFIED',
    submitted_at: new Date().toISOString()
  };

  if (existingIdx >= 0) db.submissions[existingIdx] = record;
  else db.submissions.push(record);

  res.json({ success: true, message: 'Vote recorded!', vote: record });
});

app.get(['/api/announcements', '/announcements'], authenticateToken, (req, res) => {
  const list = db.announcements || [];
  const urgentAlert = list.find(a => a.priority === 'URGENT');
  res.json({ success: true, urgent_alert: urgentAlert || null, announcements: list });
});

app.post(['/api/announcements', '/announcements'], authenticateToken, (req, res) => {
  const { title, content, priority, target_group } = req.body;
  const newAnn = {
    id: 'ann-' + Date.now(),
    title, content,
    priority: priority || 'NORMAL',
    posted_by_name: req.user.full_name,
    posted_by_role: req.user.role,
    target_group: target_group ? parseInt(target_group) : null,
    created_at: new Date().toISOString()
  };
  db.announcements.unshift(newAnn);
  res.json({ success: true, message: 'Notice broadcasted!', announcement: newAnn });
});

app.get(['/api/academics/subjects', '/academics/subjects'], authenticateToken, (req, res) => {
  res.json({ success: true, subjects: db.subjects || [] });
});

app.get(['/api/academics/timetable', '/academics/timetable'], authenticateToken, (req, res) => {
  res.json({ success: true, timetable: db.timetable || [] });
});

app.get(['/api/leaves', '/leaves'], authenticateToken, (req, res) => {
  res.json({ success: true, leaves: db.leaves || [] });
});

app.post(['/api/leaves/apply', '/leaves/apply'], authenticateToken, (req, res) => {
  const { from_date, to_date, reason } = req.body;
  const newLeave = {
    id: 'leave-' + Date.now(),
    student_id: req.user.id,
    student_name: req.user.full_name,
    roll_no: req.user.roll_no,
    group_id: req.user.group_id,
    from_date, to_date, reason,
    coordinator_status: 'PENDING',
    mentor_status: 'PENDING',
    applied_at: new Date().toISOString()
  };
  db.leaves.unshift(newLeave);
  res.json({ success: true, message: 'Leave submitted!', leave: newLeave });
});

app.get(['/api/analytics/overview', '/analytics/overview'], authenticateToken, (req, res) => {
  const students = db.users.filter(u => u.role !== 'MENTOR');
  const groupLeaderboard = db.groups.map((g, idx) => {
    const members = students.filter(s => s.group_id === g.id);
    const formSubs = db.submissions.filter(s => s.group_id === g.id);
    return {
      group_id: g.id,
      group_name: g.name,
      badge: g.badge,
      color: g.color,
      coordinator_name: g.coordinator_name,
      total_students: members.length,
      submitted: formSubs.length,
      pending: Math.max(0, members.length - formSubs.length),
      completion_pct: members.length > 0 ? Math.min(100, Math.round((formSubs.length / members.length) * 100)) : 0,
      rank: idx + 1
    };
  });

  res.json({
    success: true,
    metrics: {
      total_students: students.length,
      total_groups: db.groups.length,
      active_forms: db.forms.length,
      total_submissions: db.submissions.length,
      average_attendance: 89
    },
    groupLeaderboard
  });
});

app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'LDRP-ITR CE-A Class Command Center API is 100% LIVE and Running on Vercel!',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
