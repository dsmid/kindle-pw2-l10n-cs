/* UnicodeInputStream - Decompiled by JODE
 * Visit http://jode.sourceforge.net/
 */
import java.io.IOException;
import java.io.InputStream;
import java.io.PushbackInputStream;

public class UnicodeInputStream extends InputStream
{
    PushbackInputStream internalIn;
    boolean isInited = false;
    String defaultEnc;
    String encoding;
    private static final int BOM_SIZE = 4;

    UnicodeInputStream(InputStream inputstream, String string)
    {
        ((UnicodeInputStream) this).internalIn
        = new PushbackInputStream(inputstream, 4);
        ((UnicodeInputStream) this).defaultEnc = string;
    }

    public String getDefaultEncoding()
    {
        return ((UnicodeInputStream) this).defaultEnc;
    }

    public String getEncoding()
    {
        if (!((UnicodeInputStream) this).isInited)
        {
            try
            {
                init();
            }
            catch (IOException ioexception)
            {
                throw new IllegalStateException("Init method failed.");
            }
        }
        return ((UnicodeInputStream) this).encoding;
    }

    protected void init() throws IOException
    {
        if (!((UnicodeInputStream) this).isInited)
        {
            byte[] is = new byte[4];
            int i = ((UnicodeInputStream) this).internalIn.read(is, 0,
                    is.length);
            int i_0_;
            if (is[0] == -17 && is[1] == -69 && is[2] == -65)
            {
                ((UnicodeInputStream) this).encoding = "UTF-8";
                i_0_ = i - 3;
            }
            else if (is[0] == -2 && is[1] == -1)
            {
                ((UnicodeInputStream) this).encoding = "UTF-16BE";
                i_0_ = i - 2;
            }
            else if (is[0] == -1 && is[1] == -2)
            {
                ((UnicodeInputStream) this).encoding = "UTF-16LE";
                i_0_ = i - 2;
            }
            else if (is[0] == 0 && is[1] == 0 && is[2] == -2
                     && is[3] == -1)
            {
                ((UnicodeInputStream) this).encoding = "UTF-32BE";
                i_0_ = i - 4;
            }
            else if (is[0] == -1 && is[1] == -2 && is[2] == 0
                     && is[3] == 0)
            {
                ((UnicodeInputStream) this).encoding = "UTF-32LE";
                i_0_ = i - 4;
            }
            else
            {
                ((UnicodeInputStream) this).encoding
                = ((UnicodeInputStream) this).defaultEnc;
                i_0_ = i;
            }
            if (i_0_ > 0)
                ((UnicodeInputStream) this).internalIn.unread(is, i - i_0_,
                        i_0_);
            ((UnicodeInputStream) this).isInited = true;
        }
    }

    public void close() throws IOException
    {
        ((UnicodeInputStream) this).isInited = true;
        ((UnicodeInputStream) this).internalIn.close();
    }

    public int read() throws IOException
    {
        ((UnicodeInputStream) this).isInited = true;
        return ((UnicodeInputStream) this).internalIn.read();
    }
}
