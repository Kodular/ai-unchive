import {
  ActionIcon,
  Anchor,
  AppShell,
  Avatar,
  Button,
  Center,
  FileButton,
  Group,
  Select,
  Text
} from '@mantine/core'
import {Explorer} from './Explorer'
import React, {useState} from "react";
import {IconBrandGithub} from "@tabler/icons-react";

function App() {
  return (
    <AppShell header={{height: 48}}>
      <AppShell.Header>
        <TitleBar/>
      </AppShell.Header>
      <AppShell.Main>
        <Content/>
      </AppShell.Main>
    </AppShell>
  )
}

function UnchiveLogo() {
  return (
    <Anchor href="/" underline='never' display='inline-flex' >
      <Avatar src="logo.png" alt="logo"/>
      <Group px='xs' gap={5}>
        <Text
          span
          size="xl"
          fw={900}
          variant="gradient"
          gradient={{from: 'pink', to: 'yellow'}}
        >
          Unchive
        </Text>
        <Text span size="lg" fw={700}> by Kodular</Text>
      </Group>
    </Anchor>
  )
}

function TitleBar() {
  return (
    <Group h='100%' px='md' justify="space-between" style={{flex: 1}}>
      <UnchiveLogo/>
      <Group>
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
        <ActionIcon
          variant='default'
          component="a"
          href="https://mantine.dev"
          target="_blank"
          aria-label="Open in a new tab"
        >
          <IconBrandGithub size='1.2rem' stroke={1.5}/>
        </ActionIcon>
      </Group>
    </Group>
  )
}

function Content() {
    const [file, setFile] = useState<File | null>(null);

    if (file) {
        return <Explorer file={file}/>
    }

    return (
        <Center h="calc(100dvh - var(--app-shell-header-height))">
            <FileButton onChange={setFile} accept=".aia,.aix">
                {(props) => <Button {...props}>Select aia or aix file</Button>}
            </FileButton>
        </Center>
    )
}

export default App
