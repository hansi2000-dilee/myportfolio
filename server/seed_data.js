const db = require('./db');

const seed = async () => {
    try {
        console.log('Seeding data...');

        // 1. Update Personal Details
        console.log('Updating Personal Details...');
        const details = {
            name: 'Hansi Dileesha Rathnathilaka',
            title: 'Full-stack Software Engineer',
            description: 'A passionate and results-driven Software Engineer with a strong foundation in software development and real-world experience working with clients on live projects. Equipped with solid analytical thinking and project management skills, I focus on delivering high-quality, user-focused solutions. Committed to continuous learning and bringing value to teams and clients through technical expertise, collaboration, and a customer-first mindset.',
            email: 'hansidileesha206@gmail.com',
            phone: '94 775650717',
            address: 'No .205, Saman Pedesa, Ratnapura',
            linkedin: 'https://www.linkedin.com/in/hansi-dileesha-65b1aa255/',
            facebook: 'https://www.facebook.com/profile.php?id=100071022406204',
            github: 'https://github.com/hansi2000-dilee'
        };

        // Check if details exist, if so update, else insert. 
        // Since we likely have one row from schema.sql, we'll update it or clear and insert.
        await db.query('DELETE FROM personal_details');
        await db.query(`INSERT INTO personal_details 
            (name, title, description, email, phone, address, linkedin, github, facebook) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [details.name, details.title, details.description, details.email, details.phone, details.address, details.linkedin, details.github, details.facebook]
        );

        // 2. Skills
        console.log('Seeding Skills...');
        await db.query('DELETE FROM skills');
        const skills = [
            // Programming & Frameworks
            { category: 'Programming & Frameworks', name: 'Java' },
            { category: 'Programming & Frameworks', name: 'PHP' },
            { category: 'Programming & Frameworks', name: 'JavaScript' },
            { category: 'Programming & Frameworks', name: 'HTML/CSS' },
            { category: 'Programming & Frameworks', name: 'Laravel' },
            { category: 'Programming & Frameworks', name: 'React.js' },
            { category: 'Programming & Frameworks', name: 'MERN Stack' },
            // Databases
            { category: 'Databases', name: 'MySQL' },
            { category: 'Databases', name: 'Firebase' },
            { category: 'Databases', name: 'MongoDB' },
            // Tools
            { category: 'Tools', name: 'Postman' },
            { category: 'Tools', name: 'VS Code' },
            { category: 'Tools', name: 'NetBeans' },
            { category: 'Tools', name: 'IntelliJ' },
            { category: 'Tools', name: 'Android Studio' },
            { category: 'Tools', name: 'MySQL Workbench' },
            { category: 'Tools', name: 'Jasper Reports' },
            // Technical Skills (General)
            { category: 'Technical', name: 'REST API Development' },
            { category: 'Technical', name: 'UI/UX (Figma)' },
            { category: 'Technical', name: 'Git' },
            { category: 'Technical', name: 'QA Testing' },
            { category: 'Technical', name: 'AI-assisted Development' }
        ];

        for (const skill of skills) {
            await db.query('INSERT INTO skills (category, skill_name) VALUES (?, ?)', [skill.category, skill.name]);
        }

        // 3. Experience
        console.log('Seeding Experience...');
        await db.query('DELETE FROM experience');
        const experiences = [
            {
                role: 'Fullstack Software Engineer',
                company: 'Detz Global PVT (LTD)',
                duration: 'June 2025 - Present',
                description: 'Developed and maintained full-stack applications using the MERN stack, integrating Firebase (Client SDK + Cloud Functions).\nDesigned user-friendly UI/UX using Figma and ensured high code quality through QA testing for Cyprus-based projects.\nImplemented efficient development workflows with Git version control and prompt engineering (AI prompts).'
            },
            {
                role: 'Software Engineer',
                company: 'Nexara Solutions',
                duration: 'May 2024 - January 2025',
                description: 'Developed and maintained web applications using PHP, Laravel, and MySQL.\nImplemented REST APIs, improved code structure, and enhanced system reliability.'
            },
            {
                role: 'Trainer IT Developer',
                company: 'Office of the Provincial Director of Health Services - Western Province',
                duration: 'January 2024 - March 2024',
                description: 'Contributed to a government digitalization project, developing contact-based modules using PHP and supporting backend improvements for smoother workflow operations.\nHandled essential server configurations and deployment tasks, ensuring system stability, security, and reliable access for internal users.'
            }
        ];

        for (const exp of experiences) {
            await db.query('INSERT INTO experience (role, company, duration, description) VALUES (?, ?, ?, ?)', [exp.role, exp.company, exp.duration, exp.description]);
        }

        // 4. Projects
        console.log('Seeding Projects...');
        await db.query('DELETE FROM projects');
        const projects = [
            {
                title: 'Restaurant ERP System',
                description: 'End-to-end solution including inventory management, staff scheduling, and reporting.',
                technologies: 'MERN Stack, Firebase',
                link: ''
            },
            {
                title: 'Hotel Billing System',
                description: 'Comprehensive billing and room reservation management system.',
                technologies: 'Java, MySQL',
                link: ''
            },
            {
                title: 'Laundry Management System',
                description: 'A complete system for managing laundry services, orders, and customer tracking.',
                technologies: 'PHP, Laravel, MySQL',
                link: ''
            },
            {
                title: 'POS Application',
                description: 'Point of sale application for retail with real-time stock updates.',
                technologies: 'React, Node.js, MongoDB',
                link: ''
            },
            {
                title: 'Chat Application',
                description: 'Real-time messaging application.',
                technologies: 'Firebase, React',
                link: ''
            }
        ];

        for (const proj of projects) {
            await db.query('INSERT INTO projects (title, description, technologies, link) VALUES (?, ?, ?, ?)', [proj.title, proj.description, proj.technologies, proj.link]);
        }

        console.log('Data seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seed();
