import { useData, useRoute } from 'vitepress'
import {
  createComponent,
  createIf,
  createKeyedFragment,
  defineComponent,
  defineVaporComponent,
  h,
  onMounted,
  onUnmounted,
  onUpdated,
  renderEffect,
  setDynamicProps,
  setInsertionState,
  template,
  watch
} from 'vue'
import { contentUpdatedCallbacks } from '../utils'

const runCbs = () => contentUpdatedCallbacks.forEach((fn) => fn())

export const Content = import.meta.env.SSR
  ? defineComponent({
      name: 'VitePressContent',
      props: {
        as: { type: [Object, String], default: 'div' }
      },
      setup(props) {
        const route = useRoute()
        const { frontmatter, site } = useData()
        watch(frontmatter, runCbs, { deep: true, flush: 'post' })
        return () =>
          h(
            props.as,
            site.value.contentProps ?? { style: { position: 'relative' } },
            [
              route.component
                ? h(route.component, {
                    onVnodeMounted: runCbs,
                    onVnodeUpdated: runCbs,
                    onVnodeUnmounted: runCbs
                  })
                : '404 Page Not Found'
            ]
          )
      }
    })
  : (defineVaporComponent({
      name: 'VitePressContent',
      props: {
        as: { type: [Object, String], default: 'div' }
      },
      setup(props) {
        const route = useRoute()
        const { frontmatter, site } = useData()
        watch(frontmatter, runCbs, { deep: true, flush: 'post' })
        const tag = props.as || 'div'
        const container = template(`<${tag}></${tag}>`)() as any
        setInsertionState(container, null)
        const Wrapper = defineVaporComponent({
          setup() {
            onMounted(runCbs)
            onUpdated(runCbs)
            onUnmounted(runCbs)
            return createIf(
              () => route.component,
              () => createComponent(route.component! as any),
              () => template('404 Page Not Found')()
            )
          }
        })

        createKeyedFragment(
          () => route.path,
          () => createComponent(Wrapper)
        )

        renderEffect(() => {
          setDynamicProps(container, [
            () => site.value.contentProps ?? { style: { position: 'relative' } }
          ])
        })

        return container
      }
    }) as any)
