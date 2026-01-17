const db = require('./db');

async function updateData() {
    try {
        console.log('Starting data update...');

        // 1. Update Personal Details
        console.log('Updating Personal Details...');
        const bio = `A passionate and results-driven Software Engineer with a strong foundation in software development and real-world experience working with clients on live projects. Equipped with solid analytical thinking and project management skills, I focus on delivering high-quality, user-focused solutions. Committed to continuous learning and bringing value to teams and clients through technical expertise, collaboration, and a customer-first mindset.

KEY PROJECTS (SUMMARY):
Developed multiple web/mobile solutions including e-commerce systems, POS applications, ERP modules, chat apps, management systems, and Android apps using Java, PHP, React Native, and Firebase.

REAL CLIENT WORK:
Delivered end-to-end solutions such as a restaurant ERP, hotel billing system, and a complete laundry management system.`;

        const heroDesc = "A passionate and results-driven Software Engineer with a strong foundation in software development and real-world experience working with clients on live projects.";

        await db.query(`UPDATE personal_details SET 
            name = ?, 
            title = ?, 
            description = ?, 
            hero_description = ?, 
            email = ?, 
            phone = ?, 
            address = ?, 
            linkedin = ?, 
            github = ?, 
            facebook = ?
        `, [
            'Hansi Dileesha', // Name
            'Full-stack Software Engineer', // Title
            bio, // Description
            heroDesc, // Hero Description
            'hansidileesha206@gmail.com', // Email
            '+94 775650717', // Phone
            'No .205, Saman Pedesa, Ratnapura', // Address
            'https://www.linkedin.com/in/hansi-dileesha-65b1aa255/', // LinkedIn
            'https://github.com/hansi2000-dilee', // GitHub
            'https://www.facebook.com/profile.php?id=100071022406204' // Facebook
        ]);

        // 2. Update Experience
        console.log('Updating Experience...');
        await db.query('DELETE FROM experience'); // Clear old data
        
        const experiences = [
            {
                role: 'Fullstack Software Engineer',
                company: 'Detz Global PVT (LTD )',
                duration: 'June 2025 - Present',
                description: 'Developed and maintained full-stack applications using the MERN stack, integrating Firebase (Client SDK + Cloud Functions). Designed user-friendly UI/UX using Figma and ensured high code quality through QA testing for Cyprus-based projects. Implemented efficient development workflows with Git version control and prompt engineering (AI prompts).'
            },
            {
                role: 'Software Engineer',
                company: 'Nexara Soluions',
                duration: 'May 2024 - January 2025',
                description: 'Developed and maintained web applications using PHP, Laravel, and MySQL. Implemented REST APIs, improved code structure, and enhanced system reliability.'
            },
            {
                role: 'Trainer IT Developer',
                company: 'Office of the Provincial Director of Health Services - Western Province - Colombo',
                duration: 'January 2024 - March 2024',
                description: 'Contributed to a government digitalization project, developing contact-based modules using PHP and supporting backend improvements for smoother workflow operations. Handled essential server configurations and deployment tasks, ensuring system stability, security, and reliable access for internal users.'
            }
        ];

        for (const exp of experiences) {
            await db.query('INSERT INTO experience (role, company, duration, description) VALUES (?, ?, ?, ?)', 
                [exp.role, exp.company, exp.duration, exp.description]);
        }

        // 3. Update Education
        console.log('Updating Education...');
        // Ensure table exists first (in case schema wasn't run separately, but I rely on schemas having been run or updated. I just added it to schema.sql, but I need to make sure the specific table creation runs if I didn't run schema.sql again. I'll include a CREATE just in case for this standalone script, or rely on setup)
        await db.query(`CREATE TABLE IF NOT EXISTS education (
            id INT AUTO_INCREMENT PRIMARY KEY,
            degree VARCHAR(255) NOT NULL,
            institution VARCHAR(255) NOT NULL,
            duration VARCHAR(100),
            description TEXT
        )`);
        
        await db.query('DELETE FROM education');

        const educations = [
            {
                degree: 'BEng (Hons) in Software Engineering',
                institution: 'Java Institute for Advanced Technology',
                duration: 'Sep 2019 - Oct 2024',
                description: 'Successfully completed a full academic pathway in Software Engineering, including a Diploma (2022), Higher Diploma with UK Awards (2023), and a BEng (Hons) in Software Engineering (2022–2024), gaining solid theoretical and practical skills across modern software technologies.'
            },
            {
                degree: 'GCE A/L Examination (Bio Stream)',
                institution: 'School',
                duration: '2019 - 2020',
                description: '3 C s'
            },
            {
                degree: 'GCE O/L Examination',
                institution: 'School',
                duration: '2016',
                description: '6 A s 3 Bs'
            }
        ];

        for (const edu of educations) {
            await db.query('INSERT INTO education (degree, institution, duration, description) VALUES (?, ?, ?, ?)', 
                [edu.degree, edu.institution, edu.duration, edu.description]);
        }

        // 4. Update Skills
        console.log('Updating Skills...');
        await db.query('DELETE FROM skills');
        await db.query('DELETE FROM skill_categories');

        const skillData = {
            'Technical Skills': ['Full-stack development', 'REST API development', 'Firebase', 'MySQL', 'MongoDB', 'UI/UX (Figma)', 'Git', 'QA testing', 'AI-assisted development'],
            'Programming & Frameworks': ['Java', 'PHP', 'JavaScript', 'HTML/CSS', 'Laravel', 'React.js', 'MERN Stack'],
            'Databases': ['MySQL', 'Firebase', 'MongoDB'],
            'Tools': ['Postman', 'VS Code', 'NetBeans', 'IntelliJ', 'Android Studio', 'MySQL Workbench', 'Jasper Reports']
        };

        for (const [catName, skills] of Object.entries(skillData)) {
            // Insert Category
            const [res] = await db.query('INSERT INTO skill_categories (name) VALUES (?)', [catName]);
            // Insert Skills
            for (const skill of skills) {
                await db.query('INSERT INTO skills (category, skill_name) VALUES (?, ?)', [catName, skill]);
            }
        }

        console.log('All data updated successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error updating data:', err);
        process.exit(1);
    }
}

updateData();
