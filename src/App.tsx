import {
    Anchor,
    AppShell,
    Avatar,
    Button,
    Center,
    FileButton,
    Group,
    Header,
    MantineProvider,
    Select,
    Text
} from '@mantine/core'
import {Explorer} from './Explorer'
import React, {useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useColorScheme} from "@mantine/hooks";

const queryClient = new QueryClient()

function App() {
    const colorScheme = useColorScheme();

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS
                         theme={{
                             colorScheme,
                             primaryColor: "violet"
                         }}
        >
            <QueryClientProvider client={queryClient}>
                <AppShell
                    padding={0}
                    header={<TitleBar/>}
                    styles={(theme) => ({
                        main: {
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
                        },
                    })}
                >
                    <Content/>
                </AppShell>
            </QueryClientProvider>
        </MantineProvider>
    )
}

function TitleBar() {
    return (
        <Header height={50}>
            <Group sx={{height: '100%'}} px={20} position="apart">
                <Anchor href="/" underline={false}>
                    <Group>
                        <Avatar src="logo.png" alt="logo"/>
                        <span>
                            <Text
                                span
                                size="xl"
                                fw={700}
                                variant="gradient"
                                gradient={{from: 'pink', to: 'yellow'}}
                            >
                                Unchive
                            </Text>
                            <Text span> by Kodular</Text>
                        </span>
                    </Group>
                </Anchor>
                <Select
                    size="xs"
                    placeholder="Language"
                    defaultValue="en"
                    data={[
                        {value: 'en', label: 'English'},
                        {value: 'de', label: 'German'},
                        {value: 'es', label: 'Spanish'},
                    ]}
                />
            </Group>
        </Header>
    )
}

function Content() {
    const [file, setFile] = useState<File | null>(null);

    if (file) {
        return <Explorer file={file}/>
    }

    return (
        <Center style={{height: "100%"}}>
            <FileButton onChange={setFile} accept=".aia,.aix">
                {(props) => <Button {...props}>Select aia or aix file</Button>}
            </FileButton>
        </Center>
    )
}

export default App
