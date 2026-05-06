export interface ProjectStep {
    id: number;
    duration?: string;
    title: string;
    description: string;
    image: string;
}

export const projectsSteps: ProjectStep[] = [
    {
        id: 1,
        duration: "6-8 месяцев",
        title: "Дом «Лайнер», Московская область, Глебово",
        description: "200 м²",
        image: "/projects/glebovo.jpeg",
    },
    {
        id: 2,
        duration: "6-8 месяцев",
        title: "Дом «Сходня», г. Солнечногорск",
        description: "300 м²",
        image: "/projects/skhodnya.jpeg",
    },
    {
        id: 3,
        duration: "6-8 месяцев",
        title: "Дом «Аносино», Истринский район",
        description: "220 м²",
        image: "/projects/anosino.jpeg",
    },
    {
        id: 4,
        duration: "6-8 месяцев",
        title: "Дом «Тимоново», Солнечногорский район",
        description: "150 м²",
        image: "/projects/timonovo.jpeg",
    },
];
