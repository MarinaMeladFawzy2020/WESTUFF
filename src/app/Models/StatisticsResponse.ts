export interface StatisticsResponse{
    countBoxes: CountBoxes[],
    notificationsGraph: NotificationsGraph[],
    questionnaireGraph: QuestionnaireGraph[],
    votingGraph: VotingGraph[],
    customerGraph: CustomerGraph[]
}

export interface CountBoxes{
    No_Of_Notifications: number,
    No_Of_Questionnaire: number,
    No_Of_Voting: number,
    No_Of_Customers: number
}

export interface NotificationsGraph {
    Month: number;
    Monthtext: string;
    count: number;
}

export interface QuestionnaireGraph {
    Month: number;
    Monthtext: string;
    count: number;
    TotalParticipants: number;
}

export interface VotingGraph {
    Month: number;
    Monthtext: string;
    count: number;
    TotalParticipants: number;
}

export interface CustomerGraph {
    Month: number;
    Monthtext: string;
    count: number;
}