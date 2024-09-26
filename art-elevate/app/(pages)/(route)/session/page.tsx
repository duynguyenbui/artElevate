import {getSession, getTokenWorkAround} from '@/actions/auth-action';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {User2} from 'lucide-react';

const SessionPage = async () => {
    const session = await getSession();
    console.log(session);
    const token = await getTokenWorkAround();
    return (
        <div className="flex flex-col p-2 h-full space-y-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex space-x-2">
                        <User2 className="w-6 h-6 mr-2"/>
                        {session?.user.name}
                    </CardTitle>
                    <CardDescription className="ml-1">
                        Username: {session?.user.username}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p> Email: {session?.user.email}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SessionPage;
