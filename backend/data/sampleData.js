export const departments = [
  { id: 'DEP-01', name: 'Cardiology', description: 'Heart and cardiovascular care.' },
  { id: 'DEP-02', name: 'Neurology', description: 'Care for the brain, spine, and nervous system.' },
  { id: 'DEP-03', name: 'Orthopedics', description: 'Bone, joint, and muscle treatment.' },
  { id: 'DEP-04', name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents.' },
  { id: 'DEP-05', name: 'Dermatology', description: 'Care for skin, hair, and nail conditions.' },
  { id: 'DEP-06', name: 'General Medicine', description: 'Primary care, prevention, and general treatment.' },
  { id: 'DEP-07', name: 'Emergency', description: 'Urgent assessment and emergency treatment.' },
]

export const doctors = [
  { id: 'DR-001', name: 'Dr. Maya Patel', specialization: 'Cardiology', departmentId: 'DEP-01', contact: '555-0101', email: 'maya.patel@example.test', experience: 12, availability: 'Available' },
  { id: 'DR-002', name: 'Dr. Arjun Mehta', specialization: 'Cardiology', departmentId: 'DEP-01', contact: '555-0102', email: 'arjun.mehta@example.test', experience: 9, availability: 'Available' },
  { id: 'DR-003', name: 'Dr. Liam Chen', specialization: 'Neurology', departmentId: 'DEP-02', contact: '555-0103', email: 'liam.chen@example.test', experience: 11, availability: 'In Surgery' },
  { id: 'DR-004', name: 'Dr. Noah Williams', specialization: 'Orthopedics', departmentId: 'DEP-03', contact: '555-0104', email: 'noah.williams@example.test', experience: 8, availability: 'Available' },
  { id: 'DR-005', name: 'Dr. Ava Johnson', specialization: 'Pediatrics', departmentId: 'DEP-04', contact: '555-0105', email: 'ava.johnson@example.test', experience: 10, availability: 'Available' },
  { id: 'DR-006', name: 'Dr. Sofia Garcia', specialization: 'Dermatology', departmentId: 'DEP-05', contact: '555-0106', email: 'sofia.garcia@example.test', experience: 7, availability: 'Off Duty' },
  { id: 'DR-007', name: 'Dr. Ethan Brooks', specialization: 'General Medicine', departmentId: 'DEP-06', contact: '555-0107', email: 'ethan.brooks@example.test', experience: 14, availability: 'Available' },
  { id: 'DR-008', name: 'Dr. Priya Shah', specialization: 'Emergency Medicine', departmentId: 'DEP-07', contact: '555-0108', email: 'priya.shah@example.test', experience: 6, availability: 'Available' },
]

export const patients = [
  { id: 'PT-1001', fullName: 'Eleanor Wilson', age: 64, gender: 'Female', contact: '555-1001', email: 'eleanor.wilson@example.test', bloodGroup: 'A+', address: '12 Maple Lane', doctorId: 'DR-001', departmentId: 'DEP-01', condition: 'Hypertension', admissionDate: '2026-10-28', status: 'Stable', vitals: { bloodPressure: '138/88', heartRate: 82, temperature: 36.8 } },
  { id: 'PT-1002', fullName: 'James Mitchell', age: 71, gender: 'Male', contact: '555-1002', email: 'james.mitchell@example.test', bloodGroup: 'O+', address: '8 Cedar Street', doctorId: 'DR-002', departmentId: 'DEP-01', condition: 'Cardiac observation', admissionDate: '2026-11-02', status: 'Critical', vitals: { bloodPressure: '168/104', heartRate: 112, temperature: 37.2 } },
  { id: 'PT-1003', fullName: 'Sophia Parker', age: 34, gender: 'Female', contact: '555-1003', email: 'sophia.parker@example.test', bloodGroup: 'B+', address: '47 Lake Road', doctorId: 'DR-003', departmentId: 'DEP-02', condition: 'Migraine', admissionDate: '2026-10-30', status: 'Stable', vitals: { bloodPressure: '118/76', heartRate: 74, temperature: 36.7 } },
  { id: 'PT-1004', fullName: 'Oliver Brooks', age: 42, gender: 'Male', contact: '555-1004', email: 'oliver.brooks@example.test', bloodGroup: 'AB+', address: '3 Hill View', doctorId: 'DR-004', departmentId: 'DEP-03', condition: 'Fracture recovery', admissionDate: '2026-10-26', status: 'Recovering', vitals: { bloodPressure: '124/80', heartRate: 78, temperature: 36.9 } },
  { id: 'PT-1005', fullName: 'Amelia Cooper', age: 8, gender: 'Female', contact: '555-1005', email: 'amelia.cooper@example.test', bloodGroup: 'O-', address: '29 Birch Avenue', doctorId: 'DR-005', departmentId: 'DEP-04', condition: 'Seasonal asthma', admissionDate: '2026-11-01', status: 'Monitoring', vitals: { bloodPressure: '108/70', heartRate: 96, temperature: 37.1 } },
  { id: 'PT-1006', fullName: 'Ethan Morris', age: 29, gender: 'Male', contact: '555-1006', email: 'ethan.morris@example.test', bloodGroup: 'A-', address: '16 Park Street', doctorId: 'DR-007', departmentId: 'DEP-06', condition: 'Type 2 diabetes', admissionDate: '2026-10-21', status: 'Stable', vitals: { bloodPressure: '132/84', heartRate: 80, temperature: 36.6 } },
  { id: 'PT-1007', fullName: 'Isabella Reed', age: 5, gender: 'Female', contact: '555-1007', email: 'isabella.reed@example.test', bloodGroup: 'B-', address: '91 Oak Drive', doctorId: 'DR-005', departmentId: 'DEP-04', condition: 'Viral fever', admissionDate: '2026-11-03', status: 'Monitoring', vitals: { bloodPressure: '106/68', heartRate: 108, temperature: 38.4 } },
  { id: 'PT-1008', fullName: 'Lucas Bennett', age: 57, gender: 'Male', contact: '555-1008', email: 'lucas.bennett@example.test', bloodGroup: 'O+', address: '5 River Walk', doctorId: 'DR-003', departmentId: 'DEP-02', condition: 'Peripheral neuropathy', admissionDate: '2026-10-19', status: 'Stable', vitals: { bloodPressure: '126/82', heartRate: 76, temperature: 36.8 } },
  { id: 'PT-1009', fullName: 'Mia Robinson', age: 46, gender: 'Female', contact: '555-1009', email: 'mia.robinson@example.test', bloodGroup: 'A+', address: '20 Willow Court', doctorId: 'DR-006', departmentId: 'DEP-05', condition: 'Eczema', admissionDate: '2026-10-25', status: 'Needs Follow-up', vitals: { bloodPressure: '120/78', heartRate: 72, temperature: 36.7 } },
  { id: 'PT-1010', fullName: 'Benjamin Foster', age: 68, gender: 'Male', contact: '555-1010', email: 'benjamin.foster@example.test', bloodGroup: 'AB-', address: '14 Meadow Road', doctorId: 'DR-001', departmentId: 'DEP-01', condition: 'Coronary artery disease', admissionDate: '2026-10-31', status: 'Critical', vitals: { bloodPressure: '174/108', heartRate: 118, temperature: 37.0 } },
  { id: 'PT-1011', fullName: 'Charlotte Hughes', age: 23, gender: 'Female', contact: '555-1011', email: 'charlotte.hughes@example.test', bloodGroup: 'O+', address: '72 Garden Street', doctorId: 'DR-007', departmentId: 'DEP-06', condition: 'Iron deficiency', admissionDate: '2026-10-17', status: 'Stable', vitals: { bloodPressure: '112/72', heartRate: 84, temperature: 36.5 } },
  { id: 'PT-1012', fullName: 'Henry Collins', age: 52, gender: 'Male', contact: '555-1012', email: 'henry.collins@example.test', bloodGroup: 'B+', address: '39 King Street', doctorId: 'DR-004', departmentId: 'DEP-03', condition: 'Chronic back pain', admissionDate: '2026-10-29', status: 'Recovering', vitals: { bloodPressure: '130/82', heartRate: 79, temperature: 36.8 } },
  { id: 'PT-1013', fullName: 'Grace Turner', age: 31, gender: 'Female', contact: '555-1013', email: 'grace.turner@example.test', bloodGroup: 'A+', address: '6 Pine Crescent', doctorId: 'DR-006', departmentId: 'DEP-05', condition: 'Contact dermatitis', admissionDate: '2026-11-04', status: 'Stable', vitals: { bloodPressure: '116/74', heartRate: 70, temperature: 36.6 } },
  { id: 'PT-1014', fullName: 'Daniel Price', age: 77, gender: 'Male', contact: '555-1014', email: 'daniel.price@example.test', bloodGroup: 'O-', address: '25 Elm Street', doctorId: 'DR-008', departmentId: 'DEP-07', condition: 'Dehydration', admissionDate: '2026-11-03', status: 'Monitoring', vitals: { bloodPressure: '96/62', heartRate: 104, temperature: 37.6 } },
  { id: 'PT-1015', fullName: 'Harper Kelly', age: 16, gender: 'Female', contact: '555-1015', email: 'harper.kelly@example.test', bloodGroup: 'B+', address: '10 School Lane', doctorId: 'DR-005', departmentId: 'DEP-04', condition: 'Sports injury', admissionDate: '2026-10-24', status: 'Recovering', vitals: { bloodPressure: '110/72', heartRate: 82, temperature: 36.9 } },
  { id: 'PT-1016', fullName: 'Michael Ward', age: 59, gender: 'Male', contact: '555-1016', email: 'michael.ward@example.test', bloodGroup: 'A-', address: '55 Orchard Way', doctorId: 'DR-007', departmentId: 'DEP-06', condition: 'Chronic kidney disease', admissionDate: '2026-10-20', status: 'Needs Follow-up', vitals: { bloodPressure: '142/90', heartRate: 88, temperature: 36.8 } },
  { id: 'PT-1017', fullName: 'Lily Sanders', age: 39, gender: 'Female', contact: '555-1017', email: 'lily.sanders@example.test', bloodGroup: 'AB+', address: '2 Rose Terrace', doctorId: 'DR-002', departmentId: 'DEP-01', condition: 'Arrhythmia', admissionDate: '2026-11-02', status: 'Monitoring', vitals: { bloodPressure: '128/82', heartRate: 106, temperature: 36.9 } },
  { id: 'PT-1018', fullName: 'Samuel Gray', age: 63, gender: 'Male', contact: '555-1018', email: 'samuel.gray@example.test', bloodGroup: 'O+', address: '33 Spruce Avenue', doctorId: 'DR-008', departmentId: 'DEP-07', condition: 'Minor head injury', admissionDate: '2026-11-04', status: 'Stable', vitals: { bloodPressure: '122/78', heartRate: 80, temperature: 36.7 } },
]

export const appointments = [
  { id: 'AP-2001', patientId: 'PT-1001', doctorId: 'DR-001', departmentId: 'DEP-01', date: '2026-11-04', time: '09:30', reason: 'Blood pressure follow-up', status: 'Scheduled' },
  { id: 'AP-2002', patientId: 'PT-1002', doctorId: 'DR-002', departmentId: 'DEP-01', date: '2026-11-04', time: '10:00', reason: 'Cardiac review', status: 'Pending' },
  { id: 'AP-2003', patientId: 'PT-1003', doctorId: 'DR-003', departmentId: 'DEP-02', date: '2026-11-04', time: '10:30', reason: 'Migraine consultation', status: 'Scheduled' },
  { id: 'AP-2004', patientId: 'PT-1004', doctorId: 'DR-004', departmentId: 'DEP-03', date: '2026-11-04', time: '11:00', reason: 'Fracture recovery check', status: 'Completed' },
  { id: 'AP-2005', patientId: 'PT-1005', doctorId: 'DR-005', departmentId: 'DEP-04', date: '2026-11-04', time: '11:30', reason: 'Asthma review', status: 'Scheduled' },
  { id: 'AP-2006', patientId: 'PT-1006', doctorId: 'DR-007', departmentId: 'DEP-06', date: '2026-11-04', time: '13:00', reason: 'Routine checkup', status: 'Scheduled' },
  { id: 'AP-2007', patientId: 'PT-1007', doctorId: 'DR-005', departmentId: 'DEP-04', date: '2026-11-04', time: '14:00', reason: 'Fever follow-up', status: 'Pending' },
  { id: 'AP-2008', patientId: 'PT-1008', doctorId: 'DR-003', departmentId: 'DEP-02', date: '2026-11-05', time: '09:00', reason: 'Neurology review', status: 'Scheduled' },
  { id: 'AP-2009', patientId: 'PT-1009', doctorId: 'DR-006', departmentId: 'DEP-05', date: '2026-11-05', time: '09:30', reason: 'Skin assessment', status: 'Scheduled' },
  { id: 'AP-2010', patientId: 'PT-1010', doctorId: 'DR-001', departmentId: 'DEP-01', date: '2026-11-05', time: '10:00', reason: 'Cardiac monitoring', status: 'Pending' },
  { id: 'AP-2011', patientId: 'PT-1011', doctorId: 'DR-007', departmentId: 'DEP-06', date: '2026-11-06', time: '11:00', reason: 'Lab results review', status: 'Cancelled' },
  { id: 'AP-2012', patientId: 'PT-1012', doctorId: 'DR-004', departmentId: 'DEP-03', date: '2026-11-06', time: '13:30', reason: 'Back pain consultation', status: 'Scheduled' },
  { id: 'AP-2013', patientId: 'PT-1016', doctorId: 'DR-007', departmentId: 'DEP-06', date: '2026-11-07', time: '09:30', reason: 'Kidney function follow-up', status: 'Pending' },
  { id: 'AP-2014', patientId: 'PT-1017', doctorId: 'DR-002', departmentId: 'DEP-01', date: '2026-11-07', time: '10:30', reason: 'Heart rhythm check', status: 'Scheduled' },
]
