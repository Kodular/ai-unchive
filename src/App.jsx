import {
  AppShell,
  Avatar,
  Button,
  FileButton,
  Group,
  Header,
  MantineProvider,
  Select,
  Text,
  Center,
  Anchor
} from '@mantine/core'
import {Explorer} from './components'
import React, {useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useColorScheme} from "@mantine/hooks";

const queryClient = new QueryClient()

function App() {
  const colorScheme = useColorScheme();
  const [file, setFile] = useState(null);

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
            main: {backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]},
          })}
        >
          {
            file ?
              (
                <Explorer file={file} kind={file.name.split('.').at(-1)}/>
              )
              :
              (
                <Center style={{height: "100%"}}>
                  <FileButton onChange={setFile} accept=".aia,.aix">
                    {(props) => <Button {...props}>Select aia or aix file</Button>}
                  </FileButton>
                </Center>
              )
          }
        </AppShell>
      </QueryClientProvider>
    </MantineProvider>
  )
}

function TitleBar() {
  return (
    <Header height={60} p="xs">
      <Group sx={{height: '100%'}} px={20} position="apart">
        <Group>
          <Avatar src="logo.png" alt="logo"/>
          <Anchor href="/">
            <Text size="xl"><b>Unchive</b> by Kodular</Text>
          </Anchor>
        </Group>
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

export default App
