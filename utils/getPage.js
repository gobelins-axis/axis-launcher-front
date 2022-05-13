const TYPE_PAGE = 'page';

export default function getPage(view) {
    if (!view.$options) {
        return;
    }

    if (view.$options.type === TYPE_PAGE) {
        return view;
    }

    const children = view.$children;
    let result;
    for (let i = 0, len = children.length; i < len; i++) {
        if (children[i].$options.type === TYPE_PAGE) {
            result = children[i];
            break;
        } else if (typeof children[i].$children === 'object') {
            return getPage(children[i].$children);
        }
    }
    return result;
}
